import db from "./index";

const selectStmt = db.prepare(`
    SELECT guild_id, guild_message
    FROM guild_settings
    WHERE guild_id = ?
`);

const insertOrReplaceStmt = db.prepare(`
    INSERT OR REPLACE INTO guild_settings (guild_id, guild_message)
    VALUES (?, ?)
`);

export function setWelcomeMessage(guildId: string, message: string) {
	insertOrReplaceStmt.run(guildId, message);
}

type GuildSettingsRow = {
	guild_id: string;
	guild_message: string;
};

export function getWelcomeMessage(guildId: string) {
	const row = selectStmt.get(guildId) as GuildSettingsRow | undefined;
	if (!row) return null;

	return row.guild_message;
}
