import { generateState, generateCodeVerifier } from "arctic";
import { google } from "$lib/session/GoogleAuth";

import type { RequestEvent } from "@sveltejs/kit";
import { deleteSessionTokenCookie } from "$lib/session/session";

export async function GET(event: RequestEvent): Promise<Response> {
	deleteSessionTokenCookie(event);

	return new Response(null, {
		status: 302,
		headers: {
			Location: "/"
		}
	});
}