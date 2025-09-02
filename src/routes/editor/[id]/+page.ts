import type { LoadEvent } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { SkinPartsFormat,SkinLayersFormat } from './skin/skinTypes';
export const load = (async (ev) => {
    ev.data
    var datas=await tryLoadResource(ev,"/datas/skin_datas.json");
    var layers=await  tryLoadResource(ev,"/datas/layers.json") as SkinLayersFormat[];
    var d= datas as {[key:string]:SkinPartsFormat}    
    var skills=await tryLoadResource(ev,"/datas/skills.json") as {[id: string]: { name: string; desc: string; stages: number[],disabled?:boolean };};
    if(skills !=undefined)
    {
        var factions=await tryLoadResource(ev,"/datas/factions.json") as {  [id: string]: { name: string; desc: string; bonus: { [key: string]: number };origines: {[key: string]: {name: string;desc: string; skills: { [key: string]: number }; }; };jobs: {[key: string]: {name: string;desc: string;skills: { [key: string]: number }}}}};
        return {datas:d,sheet:ev.data.sheet,layers,skills,factions};
    }
    else
        return {datas:d,sheet:ev.data.sheet,layers};
}) satisfies PageLoad;
async function tryLoadResource(event:LoadEvent,url:string)
{
    var res=await event.fetch(url);
    if(res.ok)
        return await res.json();
    return undefined;
}