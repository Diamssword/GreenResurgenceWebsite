import type { Handle } from '@sveltejs/kit';

import "$lib/bot/bot"
export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);
	return response;
};