import { type Client, Events } from "discord.js";

export default {
	name: Events.ClientReady,
	once: true,
	execute(client: Client) {
		if (!client.user) {
			console.log("Logging in failed");
			return;
		}
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};
