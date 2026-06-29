import type { eyeType } from '$lib/skinviewer3d/textureHelper';
import type { PageLoad } from './$types';
import type { SkinLayersFormat } from '../../editor/[id]/skin/skinTypes';
import type { SkinPartsFormat } from '../../editor/[id]/skin/skinTypes';
import { dev } from '$app/environment';
import { redirect } from '@sveltejs/kit';
export const load = (async (ev) => {
  if(!dev)
    return redirect(301,"/");
      var datas=await(await ev.fetch("/datas/skin_datas.json")).json();
      var layers=await(await ev.fetch("/datas/layers.json")).json() as SkinLayersFormat[];
        var d= datas as {[key:string]:SkinPartsFormat}
        return {datas:d,layers};
}) satisfies PageLoad;