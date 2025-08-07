import { Google } from "arctic";
import {VITE_BASE_URL } from "$env/static/private";
import type { User } from "./session";
import db from "$lib/DB";

export const google = new Google(
	import.meta.env.GOOGLE_CLIENT_ID,
	import.meta.env.GOOGLE_CLIENT_SECRET,
	VITE_BASE_URL+"/login/google/callback"
);
export function createUserGoogle(googleID:string,username:string ):User{
	var id:any=db.prepare("INSERT INTO user (googleId,username) VALUES (?,?)").run(googleID,username);
	var res:any=db.prepare("SELECT * FROM user WHERE id = ?").get(id.lastInsertRowid);
	return {
		id:res.id,
		googleId:res.googleId,
		username:res.username
	}
}
export function getUserGoogle(googleID:string ):User|null{
	var res:any=db.prepare("SELECT * FROM user WHERE googleId = ?").get(googleID);
	return res;
}