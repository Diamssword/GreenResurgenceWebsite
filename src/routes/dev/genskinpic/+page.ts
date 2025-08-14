import type { eyeType } from '$lib/skinviewer3d/textureHelper';
import type { PageLoad } from './$types';
import layersOb from "$lib/datas/layers.json"
import type { SkinLayersFormat } from '../../editor/[id]/skin/skinTypes';
import type { SkinPartsFormat } from '../../editor/[id]/skin/skinTypes';
const layers= layersOb as SkinLayersFormat[]
export const load = (async (ev) => {
      var datas=await(await ev.fetch(import.meta.env.VITE_BASE_URL+"/skins/datas.json")).json();
        var d= datas as {[key:string]:SkinPartsFormat}
        return {datas:d,layers};
}) satisfies PageLoad;