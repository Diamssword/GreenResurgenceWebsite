import { dev } from '$app/environment';
import type { RequestHandler } from './$types';
import * as fs from 'fs'
import * as path from 'path'
if(!fs.existsSync("./datas/skins_display/"))
    fs.mkdirSync("./datas/skins_display/",{recursive:true})
export const POST: RequestHandler = async (ev) => {
    var dt=await ev.request.json();
    if(dev && dt.id && dt.image){
        var fold=path.dirname(dt.id)
        if(!fs.existsSync("./datas/skins_display/"+fold))
            fs.mkdirSync("./datas/skins_display/"+fold,{recursive:true});
       fs.writeFileSync("./datas/skins_display/"+dt.id+".png",dt.image.replace('data:image/png;base64,', ''),"base64");
    }
    return new Response();
};