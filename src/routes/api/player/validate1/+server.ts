import { API_KEY } from '$env/static/private';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import * as fs from 'fs'
import { checkAPIAuth, skin_datas } from '$lib/server_functions';

export const GET: RequestHandler = async () => {
    return new Response();
};
export const POST: RequestHandler = async (ev) => {
    if(checkAPIAuth(ev))
    {
        var js= await ev.request.json();
        if(js.code && js.uuid)
        {
            for(const k in skin_datas)
            {
                if(skin_datas[k].code==js.code)
                {
                    delete skin_datas[k];
                    var val=JSON.parse(fs.readFileSync("./uploaded/cache/"+js.code+".json",{encoding:"utf-8"}))
                    if(val)
                    {
                        fs.rmSync("./uploaded/cache/"+js.code+".json");
                        return new Response(JSON.stringify(val),{status:200,headers:{"Content-Type":"text/json;"}});
                    }
                   
                    return new Response("skin not found",{status:404})
                }
            }
        }               
        return error(401,{message:"bad code"});
    }
    else
    return error(403,{message:"bad token"});
};