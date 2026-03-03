import { Player } from "discord-player";
import { type Client } from "discord.js";
import { DefaultExtractors } from "@discord-player/extractor";
import { YoutubeSabrExtractor } from "discord-player-googlevideo";

let playerInstance: Player | null = null;

export async function initPlayer(client: Client): Promise<Player> {
  if (playerInstance) return playerInstance;

  const player = new Player(client as any);

  await player.extractors.loadMulti(DefaultExtractors);
  await player.extractors.register(YoutubeSabrExtractor, {});

  console.log("Registered extractors: ", player.extractors.store.map(e => e.identifier));

  player.events.on("playerStart", () => {
    console.log("[playerStart]");
  });

  player.events.on("playerFinish", () => {
    console.log("[playerFinish]");
  });

  player.events.on("playerError", (_queue, error) => {
    console.log("[playerErorr]", error);
  });

  player.events.on("connectionDestroyed", () => {
    console.log("[connectionDestroyed]");
  });

  player.events.on("disconnect", () => {
    console.log("[disconnect]");
  });

  player.events.on("emptyChannel", () => {
    console.log("[emptyChannel]");
  });

  player.events.on("emptyQueue", () => {
    console.log("[emptyQueue]");
  });

  player.events.on('debug', (_, message) => {
    console.log("[debug]", message);
  });

  playerInstance = player;
  return playerInstance;
}

export function getPlayer(): Player {
  if (!playerInstance) {
    throw new Error("Player not initialized. Call initPlayer(client) first.");
  }
  return playerInstance;
}
