import type { Collection, Interaction, SlashCommandBuilder } from "discord.js";

export type SlashCommand = {
	data: SlashCommandBuilder;
	execute: (interaction: Interaction) => Promise<unknown> | unknown;
};

declare module "discord.js" {
	export interface Client {
		commands: Collection<string, SlashCommand>;
	}
}
