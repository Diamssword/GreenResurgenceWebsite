import type { PageLoad } from './$types';
import type { SkinPartsFormat,SkinLayersFormat } from './skin/skinTypes';
export const load = (async (ev) => {
    var datas=await(await ev.fetch(import.meta.env.VITE_BASE_URL+"/datas/skin_datas.json")).json();
    var layers=await(await ev.fetch(import.meta.env.VITE_BASE_URL+"/datas/layers.json")).json() as SkinLayersFormat[];
    var skills=await(await ev.fetch(import.meta.env.VITE_BASE_URL+"/datas/skills.json")).json() as {[id: string]: { name: string; desc: string; stages: number[],disabled?:boolean };};
    var factions=await(await ev.fetch(import.meta.env.VITE_BASE_URL+"/datas/factions.json")).json() as {  [id: string]: { name: string; desc: string; bonus: { [key: string]: number };origines: {[key: string]: {name: string;desc: string; skills: { [key: string]: number }; }; };jobs: {[key: string]: {name: string;desc: string;skills: { [key: string]: number }}}}};
    var d= datas as {[key:string]:SkinPartsFormat}
    return {datas:d,sheet:ev.data.sheet,layers,skills,factions};
}) satisfies PageLoad;