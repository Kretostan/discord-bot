import { SlashCommandBuilder, MessageFlags, type Interaction } from "discord.js";
import { setWelcomeMessage } from "../../config/welcomeStore.js";

export default {
    data: new SlashCommandBuilder()
        .setName("member-add-message")
        .setDescription("Set welcome message when member join guild.")
        .addStringOption(option => option.setName("message").setDescription("Member add welcome message")),
    async execute(interaction: Interaction) {
        if (!interaction.isChatInputCommand()) return;
        if (!interaction.guildId || !interaction.options) return;
        
        const message = interaction.options.getString("message", true);
        setWelcomeMessage(interaction.guildId, message);

        return interaction.reply({ content: `Successfully set message: ${message}`, flags: MessageFlags.Ephemeral });
    }
}
