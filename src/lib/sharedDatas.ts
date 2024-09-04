import { writable } from "svelte/store";
import type { Shared } from "../app";
import type { RequestEvent } from "@sveltejs/kit";
export const SHARED=writable({} as Shared)
