import { SlashCommandBuilder, ChatInputCommandInteraction, MessageFlags, GuildMember } from "discord.js";
import { getPlayer } from "../../lib/player.js";
import play from "play-dl";

function isYouTubeUrl(query: string) {
  return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i.test(query);
}

export default {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play music from a URL or search query")
    .addStringOption(option => option.setName("query").setDescription("YouTube URL or search query")),
  async execute(interaction: ChatInputCommandInteraction) {
    const player = getPlayer();

    const member = interaction.member;
    if (!member || !("voice" in member)) {
      await interaction.reply({
        content: "This command can only be used in guild.",
        flags: MessageFlags.Ephemeral,
      });
    }

    const voiceMember = member as GuildMember;
    const channel = voiceMember.voice.channel;
    if (!channel) {
      return interaction.reply({
        content: "You are not conencted to a voice channel!",
        flags: MessageFlags.Ephemeral,
      });
    }

    let query = interaction.options.getString("query", true);
    await interaction.deferReply();

    if (isYouTubeUrl(query)) {
      const info = await play.video_basic_info(query);
      console.log(`\nGram z YouTube: ${info.video_details.title}\n`);
    }

    try {
      const { track } = await player.play(channel as any, query);
      const title = track?.cleanTitle ?? track?.title ?? query;
      await interaction.followUp(`🎵 **${title}** enqueued! 🎵`);
    } catch (error) {
      console.error(error);
      return interaction.followUp(`Something went wrong:\n${error}`);
    }
    return;
  }
}
