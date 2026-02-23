export const welcomeMessage = new Map<string, string>();

export function getWelcomeMessage(guildId: string) {
    return welcomeMessage.get(guildId);
}

export function setWelcomeMessage(guildId: string, message: string) {
    return welcomeMessage.set(guildId, message);
}
