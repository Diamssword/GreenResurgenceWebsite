import type { eyeType } from '$lib/skinviewer3d/colorHelper';
import type { PageLoad } from './$types';
export const load = (async (ev) => {
    var datas=await(await ev.fetch("/skins/parts.json")).json();
    for(var d1 in datas)
    {
        if(!datas[d1].images)
        {
            datas[d1].images=await(await ev.fetch("/skins/"+d1+"/parts.json")).json();
        }
    }
    var d= datas as {[key:string]:{title:string,images:[{id:string,name?:string,anim?:eyeType,cat?:string}],cats?:{[key:string]:string},colors?:string[]|"free"}}
    return {datas:d};
}) satisfies PageLoad;