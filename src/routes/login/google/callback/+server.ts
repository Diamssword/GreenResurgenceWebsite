import { generateSessionToken, createSession, setSessionTokenCookie } from "$lib/session/session";
import { createUserGoogle, getUserGoogle, google } from "$lib/session/GoogleAuth";
import { decodeIdToken } from "arctic";

import type { RequestEvent } from "@sveltejs/kit";
import type { OAuth2Tokens } from "arctic";

export async function GET(event: RequestEvent): Promise<Response> {
	const code = event.url.searchParams.get("code");
	const state = event.url.searchParams.get("state");
	const storedState = event.cookies.get("google_oauth_state") ?? null;
	const codeVerifier = event.cookies.get("google_code_verifier") ?? null;
	if (code === null || state === null || storedState === null || codeVerifier === null) {
		return new Response(null, {
			status: 400
		});
	}
	if (state !== storedState) {
		return new Response(null, {
			status: 400
		});
	}

	let tokens: OAuth2Tokens;
	try {
		tokens = await google.validateAuthorizationCode(code, codeVerifier);
	} catch (e) {
		// Invalid code or client credentials
		return new Response(null, {
			status: 400
		});
	}
	const claims:any = decodeIdToken(tokens.idToken());
	const googleUserId = claims.sub;
	const username = claims.name;

	const existingUser = await getUserGoogle(googleUserId);

	if (existingUser) {
		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, existingUser.id);
		setSessionTokenCookie(event, sessionToken, session.expiresAt);
		return new Response(null, {
			status: 302,
			headers: {
				Location: "/profile"
			}
		});
	}
	const user = await createUserGoogle(googleUserId, username);

	const sessionToken = generateSessionToken();
	const session = await createSession(sessionToken, user.id);
	setSessionTokenCookie(event, sessionToken, session.expiresAt);
	return new Response(null, {
		status: 302,
		headers: {
			Location: "/profile"
		}
	});
}