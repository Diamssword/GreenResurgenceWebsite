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
                    fs.copyFileSync("./uploaded/cache/"+js.code+".png","./uploaded/skins/"+js.uuid.replaceAll("-","")+".png")
                    fs.copyFileSync("./uploaded/cache/"+js.code+".json","./uploaded/skins/"+js.uuid.replaceAll("-","")+".json")
                    fs.copyFileSync("./uploaded/cache/"+js.code+"_head.png","./uploaded/skins/"+js.uuid.replaceAll("-","")+"_head.png")
                    fs.rmSync("./uploaded/cache/"+js.code+".png",);
                    fs.rmSync("./uploaded/cache/"+js.code+"_head.png",);
                    fs.rmSync("./uploaded/cache/"+js.code+".json");
                    return new Response("skin saved",{status:200})
                }
            }
        }               
        return error(401,{message:"bad code"});
    }
    else
    return error(403,{message:"bad token"});
};