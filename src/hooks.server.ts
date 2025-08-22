import("dotenv/config")
import { deleteSessionTokenCookie, setSessionTokenCookie, validateSessionToken } from '$lib/session/session';
import type { Handle } from '@sveltejs/kit';
import {init} from "$lib/layers_visitor";
import * as fs from 'fs'

if(process.env.ENABLE_BOT?.toLowerCase()=="true")
	import("$lib/bot/bot").catch(console.error)
else
	console.log("ENABLE_BOT not set to 'true', skipping...")
import("$lib/DB").catch(console.error)
clearCache();
var inited=false;
export const handle: Handle = async ({ event, resolve }) => {
	let ips=event.request.headers.get("x-forwarded-for");
	if(!inited)
	{
		init(event as any).catch(console.error)
		inited=true;
	}
	if(ips)
	{
	  event.locals.user_ip=ips.split(',')[0];
	  
	}
	  if(!event.locals.user_ip)
  		event.locals.user_ip="devIP"
	  const token = event.cookies.get("session") ?? null;
	  if (token === null) {
		  event.locals.user = undefined;
		  event.locals.session = undefined;
	  }
	  else
	  {
		const { session, user } = await validateSessionToken(token);
		if (session !== null) {
			setSessionTokenCookie(event, token, session.expiresAt);
		} else {
			deleteSessionTokenCookie(event);
		}
	
		event.locals.session = session||undefined;
		event.locals.user = user||undefined;
	  }
	const response = await resolve(event);
	return response;
};

function clearCache()
{
	if(fs.existsSync('./uploaded/cache/'))
	{
		fs.readdirSync("./uploaded/cache/").forEach(f1=>{
			fs.rmSync("./uploaded/cache/"+f1);
		})
	}
	else
	fs.mkdirSync("./uploaded/cache",{recursive:true})
	if(!fs.existsSync("./uploaded/skins"))
	{
		fs.mkdirSync("./uploaded/skins")
	}
}