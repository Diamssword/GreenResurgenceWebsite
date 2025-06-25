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
        if(dt.action=="export" && dt.datas && dt.image && dt.head){
            var code=uid.rnd();
            if(skin_datas[ev.locals.user_ip])
            {
             fs.rmSync("./uploaded/cache/"+skin_datas[ev.locals.user_ip].code+".json")
            }
            skin_datas[ev.locals.user_ip]={code,expire:dayjs().add(1,"m")};
           fs.writeFileSync("./uploaded/cache/"+code+".json",JSON.stringify({...sanitizeData(dt.datas),base64Skin:dt.image.replace('data:image/png;base64,', ''),base64SkinHead:dt.head.replace('data:image/png;base64,', '')}));
           return new Response(code);
        }
        else if(ev.locals.user?.id && dt.action=="save" && dt.sheet && dt.datas)
        {
           var d=db.prepare("UPDATE skinlayout SET data = ?, edit_at = ? WHERE user_id=  (SELECT id FROM user WHERE id = ?) AND id = ?").run(JSON.stringify(dt.datas),new Date().toUTCString(),ev.locals.user.id,dt.sheet)
            if(d && d.changes>0)
                return new Response("saved");
            return error(500,"failed")
        }
    }
  
    return error(403,{message:"No IP"});
};
function maxStrLength(text:string,max:number=300)
{
    if(text.length>max)
        return text.substring(0,max);
    return text;
}
function sanitizeData(data:any)
{
    var b={
         appearence:{
            underwear:maxStrLength(data.appearence?.underwear||"default"),
            size:maxStrLength(data.appearence?.size||67),
            slim:data.appearence?.slim==true?true:false,
        },
        stats:{
            firstname:maxStrLength(data.stats?.firstname||"Jean",128),
            lastname:maxStrLength(data.stats?.lastname||"Fète",128),
            faction:maxStrLength(data.stats?.faction||"cites_emeraude",100),
            origine:maxStrLength(data.stats?.origine||"n_granda",100),
            job:maxStrLength(data.stats?.job||"electron_libre",100),
            points:data.stats?.points
        }
    } as any;
    if(data.appearence.hair)
    {
        b.appearence.hair=maxStrLength(data.appearence.hair);
        b.appearence.hairColor=maxStrLength(data.appearence.hairColor||"5D3A1A",10);
    }
     if(data.appearence.beard)
    {
        b.appearence.beard=maxStrLength(data.appearence.beard);
        b.appearence.beardColor=maxStrLength(data.appearence.beardColor||"5D3A1A",10);
    }
    return b;
}
setInterval(()=>{
    for(var k in skin_datas)
    {
        if(skin_datas[k].expire.isBefore(dayjs()))
        {
            var code=skin_datas[k].code
            delete skin_datas[k];
            if(fs.existsSync("./uploaded/cache/"+code+".png"))
                fs.rmSync("./uploaded/cache/"+code+".png")
            if(fs.existsSync("./uploaded/cache/"+code+"_head.png"))
                fs.rmSync("./uploaded/cache/"+code+"_head.png")
            if(fs.existsSync("./uploaded/cache/"+code+".json"))
                fs.rmSync("./uploaded/cache/"+code+".json")
        }
    }
},5000)