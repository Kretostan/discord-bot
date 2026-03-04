import type { WebPoSignalOutput } from "bgutils-js";
import { BG, buildURL, GOOG_API_KEY, USER_AGENT } from "bgutils-js";
import { JSDOM } from "jsdom";
import { Innertube } from "youtubei.js";

const innertube = await Innertube.create({ retrieve_player: false });

const visitorData = innertube.session.context.client.visitorData;

if (!visitorData) {
  console.error("Could not get visitor data");
  process.exit(1);
}

const dom = new JSDOM(
  '<!DOCTYPE html><html lang="en"><head><title></title></head><body></body></html>',
  {
    url: "https://www.youtube.com/",
    referrer: "https://www.youtube.com/",
    resources: { userAgent: USER_AGENT },
  },
);

Object.assign(globalThis, {
  window: dom.window,
  document: dom.window.document,
  location: dom.window.location,
  origin: dom.window.origin,
});

if (!Reflect.has(globalThis, "navigator")) {
  // `navigator` may be non-configurable in Node.js, so only define it if absent
  Object.defineProperty(globalThis, "navigator", {
    value: dom.window.navigator,
  });
}

const challengeResponse = await innertube.getAttestationChallenge(
  "ENGAGEMENT_TYPE_UNBOUND",
);

if (!challengeResponse.bg_challenge) {
  console.error("Could not get challenge");
  process.exit(1);
}

const interpreterUrl =
  challengeResponse.bg_challenge.interpreter_url
    .private_do_not_access_or_else_trusted_resource_url_wrapped_value;

const bgScriptResponse = await fetch(`https:${interpreterUrl}`);
const interpreterJavascript = await bgScriptResponse.text();

if (!interpreterJavascript) {
  console.error("Could not load VM");
  process.exit(1);
}

new Function(interpreterJavascript)();

const botguard = await BG.BotGuardClient.create({
  program: challengeResponse.bg_challenge.program,
  globalName: challengeResponse.bg_challenge.global_name,
  globalObj: globalThis,
});

const webPoSignalOutput: WebPoSignalOutput = [];
const botguardResponse = await botguard.snapshot({ webPoSignalOutput });

const requestKey = "O43z0dpjhgX20SCx4KAo";

const integrityTokenResponse = await fetch(buildURL("GenerateIT", true), {
  method: "POST",
  headers: {
    "content-type": "application/json+protobuf",
    "x-goog-api-key": GOOG_API_KEY,
    "x-user-agent": "grpc-web-javascript/0.1",
    "user-agent": USER_AGENT,
  },
  body: JSON.stringify([requestKey, botguardResponse]),
});

const response = (await integrityTokenResponse.json()) as unknown[];

if (typeof response[0] !== "string") {
  console.error("Could not get integrity token");
  process.exit(1);
}

const integrityTokenBasedMinter = await BG.WebPoMinter.create(
  { integrityToken: response[0] },
  webPoSignalOutput,
);

const poToken =
  await integrityTokenBasedMinter.mintAsWebsafeString(visitorData);

const result = {
  poToken,
  visitorData,
};

process.stdout.write(`${JSON.stringify(result)}\n`);
