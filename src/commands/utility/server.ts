import { type Interaction, SlashCommandBuilder } from "discord.js";

export default {
	data: new SlashCommandBuilder()
		.setName("server")
		.setDescription("Provides information about the server."),
	async execute(interaction: Interaction) {
		if (!interaction.isChatInputCommand()) return;
		if (!interaction.inGuild()) return;
		if (!interaction.member) return;

		await interaction.reply(
			`This server is ${interaction?.guild?.name} and has ${interaction?.guild?.memberCount} members.`,
		);
	},
};
