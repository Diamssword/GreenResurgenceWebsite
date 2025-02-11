import ShortUniqueId from 'short-unique-id';
import type { RequestHandler } from './$types';
import * as fs from 'fs'
import dayjs from "dayjs"
import { error, json } from '@sveltejs/kit';
import { skin_datas } from '$lib/server_functions';
import db from '$lib/DB';
const uid = new ShortUniqueId({ length: 6 });

export const POST: RequestHandler = async (ev) => {
    if(ev.locals.user_ip)
    {
        var dt=await ev.request.json();
        if(dt.action=="export" && dt.datas && dt.image){
            var code=uid.rnd();
            if(skin_datas[ev.locals.user_ip])
            {
             fs.rmSync("./uploaded/cache/"+skin_datas[ev.locals.user_ip].code+".png")
             fs.rmSync("./uploaded/cache/"+skin_datas[ev.locals.user_ip].code+".json")
            }
            skin_datas[ev.locals.user_ip]={code,expire:dayjs().add(1,"m")};
           fs.writeFileSync("./uploaded/cache/"+code+".png",dt.image.replace('data:image/png;base64,', ''),"base64");
           fs.writeFileSync("./uploaded/cache/"+code+".json",JSON.stringify(dt.datas));
           return new Response(code);
        }
        else if(ev.locals.user?.id && dt.action=="save" && dt.sheet && dt.datas)
        {
           var d=db.prepare("UPDATE skinlayout SET data = ? WHERE user_id=  (SELECT id FROM user WHERE id = ?) AND id = ?").run(JSON.stringify(dt.datas),ev.locals.user.id,dt.sheet)
            if(d && d.changes>0)
                return new Response("saved");
            return error(500,"failed")
        }
    }
  
    return error(403,{message:"No IP"});
};
setInterval(()=>{
for(var k in skin_datas)
{
    if(skin_datas[k].expire.isBefore(dayjs()))
    {
        var code=skin_datas[k].code
        delete skin_datas[k];
        if(fs.existsSync("./uploaded/cache/"+code+".png"))
            fs.rmSync("./uploaded/cache/"+code+".png")
        if(fs.existsSync("./uploaded/cache/"+code+".json"))
            fs.rmSync("./uploaded/cache/"+code+".json")
    }
}
},5000)