export const schemaSql = `
    CREATE TABLE IF NOT EXISTS guild_settings (
        guild_id TEXT PRIMARY KEY,
        guild_message TEXT
    );
`;
