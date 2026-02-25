import { SlashCommandBuilder, MessageFlags, PermissionFlagsBits, type Interaction } from "discord.js";
import { setWelcomeMessage } from "../../db/guildSettings.js";

export default {
    data: new SlashCommandBuilder()
        .setName("member-add-message")
        .setDescription("Set welcome message when member join guild.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false)
        .addStringOption(option => option.setName("message").setDescription("Member add welcome message")),
    async execute(interaction: Interaction) {
        if (!interaction.isChatInputCommand() || !interaction.guildId) return;
        if (!interaction || !interaction.memberPermissions || !interaction.memberPermissions.has(PermissionFlagsBits.Administrator)) return;
        
        const message = interaction.options.getString("message", true);
        setWelcomeMessage(interaction.guildId, message);

        return interaction.reply({ content: `Successfully set message: ${message}`, flags: MessageFlags.Ephemeral });
    }
}
