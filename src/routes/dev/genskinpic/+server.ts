import { dev } from '$app/environment';
import type { RequestHandler } from './$types';
import * as fs from 'fs'
import * as path from 'path'
export const POST: RequestHandler = async (ev) => {
    var dt=await ev.request.json();
    if(dev && dt.id && dt.image){
        var fold=path.dirname(dt.id)
        if(!fs.existsSync("./static/skins/display/"+fold))
            fs.mkdirSync("./static/skins/display/"+fold,{recursive:true});
       fs.writeFileSync("./static/skins/display/"+dt.id+".png",dt.image.replace('data:image/png;base64,', ''),"base64");
    }
    return new Response();
};