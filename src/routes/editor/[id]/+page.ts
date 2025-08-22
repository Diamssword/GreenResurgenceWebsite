import type { PageLoad } from './$types';
import type { SkinPartsFormat,SkinLayersFormat } from './skin/skinTypes';
export const load = (async (ev) => {
    ev.data
    var datas=await(await ev.fetch("/datas/skin_datas.json")).json();
    var layers=await(await ev.fetch("/datas/layers.json")).json() as SkinLayersFormat[];
    var d= datas as {[key:string]:SkinPartsFormat}
    if(ev.data.stats_enabled==true)
    {
        var skills=await(await ev.fetch("/datas/skills.json")).json() as {[id: string]: { name: string; desc: string; stages: number[],disabled?:boolean };};
        var factions=await(await ev.fetch("/datas/factions.json")).json() as {  [id: string]: { name: string; desc: string; bonus: { [key: string]: number };origines: {[key: string]: {name: string;desc: string; skills: { [key: string]: number }; }; };jobs: {[key: string]: {name: string;desc: string;skills: { [key: string]: number }}}}};
        
        return {datas:d,sheet:ev.data.sheet,layers,skills,factions};
    }
    else
        return {datas:d,sheet:ev.data.sheet,layers,};
}) satisfies PageLoad;