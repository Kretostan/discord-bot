import { Events, type Guild } from "discord.js";

export default {
	name: Events.GuildCreate,
	execute(guild: Guild) {
		if (!guild.systemChannel) {
			console.log("Error while joining server");
		}
		const channel = guild.systemChannel;
		if (channel) {
			channel.send(`Hello ${guild.name}!`);
		}
	},
};
