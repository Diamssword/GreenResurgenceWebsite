import fs from "fs";
import { join } from "path";
import type { SkinLayersFormat, SkinPartsFormat, TextureInfos } from "../routes/editor/[id]/skin/skinTypes";
import type { RequestEvent } from "../routes/$types";
export var layers: SkinLayersFormat[];
export async function init(event: RequestEvent) {
  const route = join(process.cwd(), "datas/skins/");
  if (!fs.existsSync(route)) {
    fs.mkdirSync(route, { recursive: true });
  }
  var generated: { [key: string]: SkinPartsFormat } = {};

  console.log("trying to read files from ", route);
  layers = (await (await event.fetch("/datas/layers.json")).json()) as SkinLayersFormat[];

  for (let layer of layers) {
    if (fs.existsSync(route + layer.name)) {
      if (layer.cats) {
        const g = (generated[layer.name] = { title: layer.display || layer.name, cats: {} as any, splited: layer.splited });
        for (let k1 of Object.keys(layer.cats)) {
          if (fs.existsSync(route + layer.name + "/" + k1)) g.cats[k1] = { name: layer.cats[k1].name, images: readFiles(route + layer.name + "/" + k1, layer.clearable) };
        }
      } else generated[layer.name] = { title: layer.display || layer.name, images: readFiles(route + layer.name, layer.clearable), splited: layer.splited };
    }
  }

  function readFiles(path: string, withClear?: boolean) {
    let res: TextureInfos[] = [];
    if (withClear) res.push({ id: "clear" });
    fs.readdirSync(path).forEach((v) => {
      if (fs.statSync(path + "/" + v).isDirectory()) {
        let subs: TextureInfos[] = [];
        // if(withClear)
        //   subs.push({id:"clear"})
        fs.readdirSync(path + "/" + v).forEach((v1) => {
          if (v1.endsWith(".png")) subs.push({ id: v1.substring(0, v1.length - 4) });
        });
        res.push({ id: v, subs });
      } else {
        if (v.endsWith(".png")) res.push({ id: v.substring(0, v.length - 4) });
      }
    });
    return res;
  }
  fs.writeFileSync(join(process.cwd(), "datas/skin_datas.json"), JSON.stringify(generated));
}
