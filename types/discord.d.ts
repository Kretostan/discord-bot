import { Collection } from "discord.js";

declare module "discord.js" {
    export interface Client {
        commands: Collection<string, any>; // Or more specific type instead of "any"
    }
}
