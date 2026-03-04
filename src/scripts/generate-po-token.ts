import { BG } from "bgutils-js";
import { JSDOM } from "jsdom";

const requestKey = "O43z0dpjhgX20SCx4KAo";
const dom = new JSDOM();

Object.assign(globalThis, {
  window: dom.window,
  document: dom.window.document,
});

const bgConfig = {
  fetch: (url: RequestInfo | URL, options?: RequestInit) => fetch(url, options),
  globalObj: dom.window as unknown as Record<string, unknown>,
  identifier: "",
  requestKey,
};

const challenge = await BG.Challenge.create(bgConfig);

if (!challenge) {
  console.error("Could not get challenge");
  process.exit(1);
}

const scriptValue =
  challenge.interpreterJavascript
    .privateDoNotAccessOrElseSafeScriptWrappedValue;
if (scriptValue) new Function(scriptValue)();

const { poToken } = await BG.PoToken.generate({
  program: challenge.program,
  globalName: challenge.globalName,
  bgConfig,
});

const result = {
  poToken,
  visitorData: challenge.interpreterHash,
};

process.stdout.write(`${JSON.stringify(result)}\n`);
