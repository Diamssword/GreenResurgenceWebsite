import type { Handle } from '@sveltejs/kit';

import("$lib/bot/bot").catch(console.error)
import("$lib/DB").catch(console.error)
import * as fs from 'fs'
clearCache();
export const handle: Handle = async ({ event, resolve }) => {
	let ips=event.request.headers.get("x-forwarded-for");
	if(ips)
	{
	  event.locals.user_ip=ips.split(',')[0];
	  
	}
	  if(!event.locals.user_ip)
  		event.locals.user_ip="devIP"
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
	fs.mkdirSync("./uploaded/cache")
	if(!fs.existsSync("./uploaded/skins"))
	{
		fs.mkdirSync("./uploaded/skins")
	}
}