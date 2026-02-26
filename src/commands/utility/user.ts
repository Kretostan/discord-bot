import { type Interaction, SlashCommandBuilder } from "discord.js";

export default {
	data: new SlashCommandBuilder()
		.setName("user")
		.setDescription("Provides information about the user."),
	async execute(interaction: Interaction) {
		if (!interaction.isChatInputCommand()) return;
		if (!interaction.inGuild()) return;
		if (!interaction.member) return;

		const guild = interaction.guild;
		if (!guild) return;
		const member = await guild.members.fetch(interaction.user.id);

		await interaction.reply(
			`This command was run by ${interaction.user.username}, who joined on ${member.joinedAt}.`,
		);
	},
};
