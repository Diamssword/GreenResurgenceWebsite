import type { eyeType } from '$lib/skinviewer3d/textureHelper';
import type { PageLoad } from './$types';
import type { SkinPart, SkinPartsFormat } from './skin/skinTypes';
export const load = (async (ev) => {
    var datas=await(await ev.fetch("/skins/parts.json")).json();
    for(var d1 in datas)
    {
        if(!datas[d1].images)
        {
            datas[d1].images=await(await ev.fetch("/skins/"+d1+"/parts.json")).json();
        }
    }
    var d= datas as {[key:string]:SkinPartsFormat}
    return {datas:d,sheet:ev.data.sheet};
}) satisfies PageLoad;