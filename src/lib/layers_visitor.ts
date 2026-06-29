import fs from "fs";
import { join } from "path";
import type { SkinLayersFormat, SkinPartsFormat, TextureInfos } from "../routes/editor/[id]/skin/skinTypes";
import type { RequestEvent } from "../routes/$types";
import create from "./vignetteGenerator";
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
    fs.readdirSync(path).forEach((v1) => {
      let v = sanitizeName(path, v1);
      if (fs.statSync(path + "/" + v).isDirectory()) {
        let subs: TextureInfos[] = [];
        // if(withClear)
        //   subs.push({id:"clear"})
        fs.readdirSync(path + "/" + v).forEach((v2) => {
          if (v2.endsWith(".png")) {
            let v3 = sanitizeName(path, v2);
            subs.push({ id: v3.substring(0, v3.length - 4), name: v2.substring(0, v2.length - 4) });
          }
        });
        res.push({ id: v, subs, name: v1 });
      } else {
        if (v.endsWith(".png")) res.push({ id: v.substring(0, v.length - 4), name: v1.substring(0, v.length - 4) });
      }
    });
    return res;
  }
  fs.writeFileSync(join(process.cwd(), "datas/skin_datas.json"), JSON.stringify(generated));

  if (process.env.DISABLE_VIGNETTE_GEN?.toLowerCase() != "true") create(event).catch(console.error);
  else console.log("DISABLE_VIGNETTE_GEN set to 'true', skipping vignette generation...");
}
function sanitizeName(path: string, file: string) {
  const sanitized = file
    .normalize("NFD") // Separate accents from letters
    .replace(/[\u0300-\u036f]/g, "") // Remove accent marks
    .toLowerCase()
    .replace(/[^a-z0-9._/-]/g, "_");
  if (file != sanitized) {
    console.info("Renamed: " + path + "/" + file + "=>" + path + "/" + sanitized);
    fs.renameSync(join(path, file), join(path, sanitized));
    return sanitized;
  }
  return file;
}
