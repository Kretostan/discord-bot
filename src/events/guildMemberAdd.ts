import { Events, userMention, type GuildMember } from "discord.js";
import { getWelcomeMessage } from "../config/welcomeStore.js";

export default {
    name: Events.GuildMemberAdd,
    execute(member: GuildMember) {
        if (!member) return; 
        if (!member.guild.systemChannel) return; 

        const mention = userMention(member.id);
        const channel = member.guild.systemChannel;
        const message = getWelcomeMessage(member.guild.id);
        if (!message) {
            return channel.send(`Welcome ${mention}!`);
        }
        return channel.send(`Welcome ${mention}!\n${message}`);
    }
}
