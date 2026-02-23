import { Events, userMention, type GuildMember } from "discord.js";

export default {
    name: Events.GuildMemberAdd,
    execute(member: GuildMember) {
        if (!member) {
            console.log("No user found");
        }
        const channel = member.guild.systemChannel;
        const mention = userMention(member.id);
        if (channel) {
            channel.send(`Welcome ${mention}!`);
        }
    }
}
