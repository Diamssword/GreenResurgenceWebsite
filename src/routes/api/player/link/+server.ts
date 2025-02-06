import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import * as fs from 'fs'
import { checkAPIAuth, account_linking } from '$lib/server_functions';
import db from '$lib/DB';
var justChanged:number[]=[]
export const GET: RequestHandler = async (ev) => {
    if(ev.locals.user)
    {
        var uuid:any=db.prepare("SELECT minecraftId FROM user WHERE id = ?").get(ev.locals.user.id);
        var res:any={}
        if(uuid.minecraftId)
        {
           res.uuid=uuid.minecraftId
           var quer=await fetch("https://api.minecraftservices.com/minecraft/profile/lookup/"+res.uuid);
           if(quer.status==200)
           {
            res.name=(await quer.json()).name;
           }
           if(justChanged.includes(ev.locals.user.id))
           {
                res.changed=true;
                justChanged.splice(justChanged.indexOf(ev.locals.user.id));
           }
        }
        return new Response(JSON.stringify(res))
    }
    return error(401,"need to be authentified");
};
export const POST: RequestHandler = async (ev) => {
    if(checkAPIAuth(ev))
    {
        var js= await ev.request.json();
        if(js.code && js.uuid)
        {
            for(const k in account_linking)
            {
                if(account_linking[k].code==js.code)
                {
                    delete account_linking[k];
                    db.prepare("UPDATE user SET minecraftId = ? WHERE id = ?").run(js.uuid,k);
                    justChanged.push(parseInt(k));
                    return new Response("account linked",{status:200})
                }
            }
        }               
        return error(401,{message:"bad code"});
    }
    else
    return error(403,{message:"bad token"});
};