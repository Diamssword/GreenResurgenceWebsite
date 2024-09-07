import { dev } from '$app/environment';
import type { RequestHandler } from './$types';
import * as fs from 'fs'
export const POST: RequestHandler = async (ev) => {
    var dt=await ev.request.json();
    if(dev && dt.id && dt.sub && dt.image){
        if(!fs.existsSync("./static/skins/display/"+dt.sub))
            fs.mkdirSync("./static/skins/display/"+dt.sub,{recursive:true});
       fs.writeFileSync("./static/skins/display/"+dt.sub+"/"+dt.id+".png",dt.image.replace('data:image/png;base64,', ''),"base64");
    }
    return new Response();
};