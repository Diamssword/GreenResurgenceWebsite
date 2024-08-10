// See https://kit.svelte.dev/docs/types#app

import type { ApplicationCommand, CacheType, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}
export type Command={
command:ApplicationCommand|SlashCommandBuilder,
action:(ctx:ChatInputCommandInteraction<CacheType> )=>Promise<void>
}
export {};
