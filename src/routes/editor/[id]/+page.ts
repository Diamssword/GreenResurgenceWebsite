import type { PageLoad } from './$types';
import layersOb from "$lib/datas/layers.json"
import type { SkinPartsFormat,SkinLayersFormat } from './skin/skinTypes';
const layers= layersOb as SkinLayersFormat[]
export const load = (async (ev) => {
    var datas=await(await ev.fetch(import.meta.env.VITE_BASE_URL+"/skins/datas.json")).json();
    console.log(import.meta.env.VITE_BASE_URL+"/skins/datas.json")
    console.log(datas)
    var d= datas as {[key:string]:SkinPartsFormat}
    return {datas:d,sheet:ev.data.sheet,layers};
}) satisfies PageLoad;