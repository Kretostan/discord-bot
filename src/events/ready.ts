import { type Client, Events } from "discord.js";
import { initPlayer } from "../lib/player.js";

export default {
  name: Events.ClientReady,
  once: true,
  async execute(client: Client<true>) {
    console.log(`Ready! Logged in as ${client.user.tag}`);
    await initPlayer(client);
    console.log("Music player initialized, and extractors loaded.");
  },
};
