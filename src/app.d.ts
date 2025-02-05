// See https://kit.svelte.dev/docs/types#app

import type { Session, User } from "$lib/session/session";
import type { ApplicationCommand, CacheType, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		 interface Locals {
			user_ip?:string,
			user: User | null;
			session: Session | null;
		 }
		 interface PageData {
			user:User|null;
		 }
		// interface PageState {}
		// interface Platform {}
	}
}
export type Command={
command:ApplicationCommand|SlashCommandBuilder,
action:(ctx:ChatInputCommandInteraction<CacheType> )=>Promise<void>
}
export type Shared={
title?:string
}
export {};
