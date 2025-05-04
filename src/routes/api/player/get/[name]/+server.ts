import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { checkAPIAuth, account_linking } from '$lib/server_functions';
import db from '$lib/DB';
import fs from "fs";
var justChanged:number[]=[]
export const GET: RequestHandler = async (ev) => {
            var name = ev.params.name;
            if(name)
            {
                var quer=await fetch("https://api.minecraftservices.com/minecraft/profile/lookup/name/"+name);
                if(quer.status==200)
                {
                     var id=(await quer.json()).id;
                     if(id)
                     {
                        var r={uuid:id,exist:false};
                        if(fs.existsSync('./uploaded/skins/' + id+".json"))
                        {
                            r.exist=true;
                        }
                        return new Response(JSON.stringify(r),{headers:{"Content-Type":"text/json;"}});
                     }
                }
            }
            return error(404,"not found");
};