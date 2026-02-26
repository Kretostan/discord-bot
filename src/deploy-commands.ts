import fs from "node:fs";
import path from "node:path";
import "./utils/dotenv";
import { REST, Routes } from "discord.js";

const __dirname = import.meta.dirname;

const token = String(process.env.DISCORD_TOKEN);
const clientId = String(process.env.CLIENT_ID);
const guildId = String(process.env.GUILD_ID);

const commands = [];
// Grab all the command folders from the commands directory you created earlier
const foldersPath = `${__dirname}/commands`;
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	// Grab all the command files from the commands directory you created earlier
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs
		.readdirSync(commandsPath)
		.filter((file) => file.endsWith(".js"));
	// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = (await import(filePath)).default;
		if ("data" in command && "execute" in command) {
			commands.push(command.data.toJSON());
		} else {
			console.log(
				`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
			);
		}
	}
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

// and deploy your commands!
(async () => {
	try {
		console.log(
			`Started refreshing ${commands.length} application (/) commands.`,
		);

		// The put method is used to fully refresh all commands in the guild with the current set
		if (process.env.NODE_ENV !== "production") {
			const data = await rest.put(
				Routes.applicationGuildCommands(clientId, guildId),
				{ body: commands },
			);
			if (Array.isArray(data)) {
				console.log(
					`Successfully reloaded ${data.length} application (/) commands in dev mode.`,
				);
			}
		} else {
			const data = await rest.put(Routes.applicationCommands(clientId), {
				body: commands,
			});
			if (Array.isArray(data)) {
				console.log(
					`Successfully reloaded ${data.length} application (/) commands in prod mode.`,
				);
			}
		}
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();
