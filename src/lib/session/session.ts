import db from "$lib/DB";
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import type { RequestEvent } from "@sveltejs/kit";

export function generateSessionToken(): string {
	const bytes = new Uint8Array(20);
	crypto.getRandomValues(bytes);
	const token = encodeBase32LowerCaseNoPadding(bytes);
	return token;
}

export function createSession(token: string, userId: number): Session {
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const session: Session = {
		id: sessionId,
		userId,
		expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
	};
	db.prepare(
		"INSERT INTO session (id, user_id, expires_at) VALUES (?, ?, ?)").run(session.id,
            session.userId,
            Math.floor(session.expiresAt.getTime() / 1000));
	return session;
}

export function validateSessionToken(token: string): SessionValidationResult {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const row:any = db.prepare("SELECT session.id, session.user_id, session.expires_at, user.id, user.username FROM session INNER JOIN user ON user.id = session.user_id WHERE session.id = ?").get(sessionId);
	if (!row) {
		return { session: null, user: null };
	}
	const session: Session = {
		id: row.id,
		userId: row.user_id,
		expiresAt: new Date(row.expires_at * 1000)
	};
	const user: User = {
		id: row.user_id,
        username:row.username
	};
	if (Date.now() >= session.expiresAt.getTime()) {
		db.prepare("DELETE FROM session WHERE id = ?").run(session.id);
		return { session: null, user: null };
	}
	if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
		session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
		db.prepare("UPDATE session SET expires_at = ? WHERE id = ?")
        .run(Math.floor(session.expiresAt.getTime() / 1000),session.id);
	}
	return { session, user };
}

export function invalidateSession(sessionId: string): void {
	db.prepare("DELETE FROM session WHERE id = ?").run(sessionId);
}
export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date): void {
	event.cookies.set("session", token, {
		httpOnly: true,
		sameSite: "lax",
		expires: expiresAt,
		path: "/"
	});
}

export function deleteSessionTokenCookie(event: RequestEvent): void {
	event.cookies.set("session", "", {
		httpOnly: true,
		sameSite: "lax",
		maxAge: 0,
		path: "/"
	});
}
export type SessionValidationResult =
	| { session: Session; user: User }
	| { session: null; user: null };

export interface Session {
	id: string;
	userId: number;
	expiresAt: Date;
}

export interface User {
	id: number;
    googleId?:string,
    minecraftId?:string,
    username:string,
}