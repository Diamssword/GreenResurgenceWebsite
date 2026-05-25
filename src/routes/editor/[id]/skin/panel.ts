import type { ColorRepresentation } from "three";
import type { PickedTextureInfos, SaveFormat, SkinLayerInstance, SkinLayersFormat, SkinPartsFormat, TextureInfos } from "./skinTypes";
import type { LayerInfo, SkinViewer } from "$lib/skinviewer3d/skinview3d";
import type { PageData } from "../$types";
import { browser } from "$app/environment";
import { SHARED } from "$lib/sharedDatas";
import { getSkinSize, setSkinSize } from "$lib/skinviewer3d/textureHelper";
export const BASE = "base";
export class SkinEditor {
  skinLib: { datas: { [key: string]: SkinPartsFormat }; layers: SkinLayersFormat[] };
  viewer?: SkinViewer;
  layers: SkinLayerInstance[] = [];
  slim?: boolean;
  inited: boolean = false;
  listeners: (() => void)[] = [];
  private textureChangeListeners: { [layer: string]: { index: number; fn: (picked?: PickedTextureInfos) => void }[] } = {};
  saveFn: (data: SaveFormat["skin"]) => void;
  constructor(skinLib: PageData) {
    this.skinLib = skinLib;
    setSkinSize((this.skinLib.layers.find((v) => v.name == BASE) as any).skinRes);
    this.viewer = undefined;
    this.saveFn = () => {};
  }
  onLoaded(callback: () => void) {
    if (this.inited == true) callback();
    this.listeners.push(callback);
  }
  onTextureChange(layer: string, index: number, callback: (picked?: PickedTextureInfos) => void) {
    if (!this.textureChangeListeners[layer]) this.textureChangeListeners[layer] = [];
    this.textureChangeListeners[layer].push({ index, fn: callback });
    return this.getPickedTexture(layer, index);
  }
  setViewer(viewer: SkinViewer) {
    this.viewer = viewer;
    if (this.layers.length == 0) {
      this.skinLib.layers.forEach((k) => {
        if (k.splited) {
          var l = this.findLayer(k.name, this.createLayer(k, "left"));
          var l1 = this.findLayer(k.name, this.createLayer(k, "right"));
          if (l) l.texture = this.getDefaultTextureFor(k.name);
          if (l1) l1.texture = this.getDefaultTextureFor(k.name);
        } else {
          var l = this.findLayer(k.name, this.createLayer(k));
          if (l) l.texture = this.getDefaultTextureFor(k.name);
        }
      });
    }
  }
  pickTexture(layer: string, texture: PickedTextureInfos, index?: number) {
    const lay = this.findLayer(layer, index || 0);
    if (lay) {
      lay.texture = texture;
      this.reloadPart(lay);
    }
    return texture;
  }
  private findLayer(cat: string, index: number) {
    return this.layers.find((l) => l.parent.name == cat && l.index == index);
  }
  getPickedTexture(layer: string, index?: number) {
    return this.findLayer(layer, index || 0)?.texture;
  }
  getLayersOfType(layerType: string) {
    return this.layers.filter((v) => v.parent.name == layerType);
  }
  getLayerOfType(layerType: string, index: number) {
    return this.layers.find((v) => v.parent.name == layerType && v.index == index);
  }
  getLayerTypeCount(layer: string) {
    let c = -1;
    this.layers.forEach((v) => {
      if (v.parent.name == layer) {
        if (v.index >= c) c = v.index + 1;
      }
    });
    if (c < 0) return 0;
    return c;
  }
  getOrCreateLayer(type: SkinLayersFormat, index: number, side?: "left" | "right") {
    const l = this.findLayer(type.name, index);

    if (!l) return this.findLayer(type.name, this.createLayer(type, side));
    return l;
  }
  createLayer(type: SkinLayersFormat, side?: "left" | "right") {
    const nL = { name: type.name, index: this.getLayerTypeCount(type.name), parent: type, side };
    this.layers.push(nL);
    this.viewer?.addLayer({ name: nL.name + nL.index, size: type.size + 0.01, external: type.external }, this.slim);
    return nL.index;
  }
  removeLayer(layer: string, index: number) {
    this.viewer?.removeLayer(layer + index);
    this.layers = this.layers.filter((v) => !(v.parent.name == layer && v.index == index));
    this.textureChangeListeners[layer] = this.textureChangeListeners[layer].filter((v) => v.index != index);
    this.saveFn?.(this.toJson());
  }
  loadSavedOrDefault(saved: SaveFormat["skin"]) {
    if (this.skinLib && this.viewer) {
      saved.forEach((lay) => {
        var parent = this.skinLib.layers.find((v) => v.name == lay.id);
        if (parent) {
          var lay1 = this.getOrCreateLayer(parent, lay.index, lay.side);
          if (lay1) lay1.texture = lay.texture;
        }
      });
      this.layers.forEach((l) => this.reloadPart(l));
      this.listeners.forEach((v) => v());
    }
  }
  clearPart(cat: string, index?: number) {
    const d = this.findLayer(cat, index || 0);
    if (d) {
      d.texture = undefined;
      this.reloadPart(d);
    }
  }
  reloadPart(layer: SkinLayerInstance) {
    if (this.textureChangeListeners[layer.parent.name]) {
      this.textureChangeListeners[layer.parent.name].forEach((v) => {
        if (v.index == layer.index) {
          v.fn(this.getPickedTexture(layer.parent.name, v.index));
        }
      });
    }
    if (this.skinLib && this.viewer) {
      var text = layer.texture || "clear";
      var side = layer.parent.splited ? layer.side : undefined;
      if (text == "clear") this.viewer.loadSkin(layer.parent.name + layer.index, "/skins/clear.png");
      else {
        this.viewer.loadSkin(layer.parent.name + layer.index, "/datas/skins/" + this.getTexturePath(layer), { side, model: this.slim ? "slim" : "default" });
      }
      this.saveFn?.(this.toJson());
    }
  }
  getTextureIconPath(layer: string, textureID: string, group?: string, cat?: string) {
    var l = layer + "/";
    if (cat) l = l + cat + "/";
    if (group) l = l + group + "/";

    return l + textureID + ".png";
  }
  getTexturePath(lay: SkinLayerInstance) {
    let p = lay.parent.name + "/";
    if (lay.texture) {
      if (lay.texture.category) p = p + lay.texture.category + "/";
      if (lay.texture.subs) p = p + lay.texture.subs + "/";

      p = p + lay.texture.id;
    }
    return p + ".png";
  }
  toJson() {
    var res: SaveFormat["skin"] = [];
    for (let k of this.layers) {
      //if(k.texture)
      res.push({ id: k.parent.name, index: k.index, texture: k.texture, side: k.side });
    }
    return res;
  }
  private collectLayers(allLayers?: boolean) {
    var exportedLayers: SkinLayerInstance[] = [];
    this.layers.forEach((l) => {
      if (l.parent.external != true || allLayers == true) {
        if (this.viewer) {
          exportedLayers.push(l);
        }
      }
    });
    var res: HTMLCanvasElement[] = [];
    exportedLayers
      .sort((a, b) => a.parent.size + a.index * 0.001 - (b.parent.size + b.index * 0.001))
      .forEach((l) => {
        if (this.viewer) res.push(this.viewer.skinCanvas[l.parent.name + l.index]);
      });
    return res;
  }
  toPNG(allLayers?: boolean) {
    var canv = document.createElement("canvas");
    canv.width = canv.height = getSkinSize();
    var ctx = canv.getContext("2d");
    this.collectLayers(allLayers).forEach((l) => {
      if (l) ctx?.drawImage(l, 0, 0);
    });
    ctx?.save();
    return canv.toDataURL("png");
  }
  toPNGHead(allLayers?: boolean) {
    var canv = document.createElement("canvas");
    canv.width = canv.height = 16;
    var ctx = canv.getContext("2d");
    var ctx = canv.getContext("2d");
    this.collectLayers(allLayers).forEach((l) => {
      ctx?.drawImage(l, 16, 16, 16, 16, 0, 0, 16, 16);
    });
    ctx?.save();
    return canv.toDataURL("png");
  }
  getDefaultTextureFor(layerType: string) {
    const li = this.skinLib.datas[layerType];
    let ts = li.images;
    let cat = "";
    if (li.cats) {
      cat = Object.keys(li.cats)[0];
      ts = li.cats[cat].images;
    }
    if (ts) {
      let p = ts[0];
      if (p.id == "clear") p = ts[1];
      return { id: p.subs ? p.subs[0].id : p.id, subs: p.subs ? p.id : "", category: cat } as PickedTextureInfos;
    }
  }
}
export function getProfileSaver(sheetId: number, datas: SaveFormat) {
  var timeout: NodeJS.Timeout;
  if (!datas.apparence) datas.apparence = { size: 40, slim: false };
  if (!datas.skin) datas.skin = [];
  if (!datas.stats) datas.stats = { points: {} } as any;
  return {
    loader: () => datas,
    saver: (data: SaveFormat) => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        fetch("", {
          method: "POST",
          body: JSON.stringify({
            action: "save",
            sheet: sheetId,
            datas: data,
          }),
        }).then((e) => {
          if (e.status != 200)
            SHARED.update((o) => {
              return { ...o, error: "Impossible de sauvgarder le skin" };
            });
        });
      }, 1000);
    },
  };
}
export var localLoader = () => {
  if (browser) {
    var str = window.localStorage.getItem("character_builder_datas");
    if (str != null) {
      try {
        return JSON.parse(str) as SaveFormat;
      } catch {
        return { apparence: {}, skin: [], stats: { points: {} } } as any as SaveFormat;
      }
    }
  }
  return { apparence: {}, skin: [], stats: { points: {} } } as any as SaveFormat;
};
export function localSaver(data: SaveFormat) {
  if (browser) {
    window.localStorage.setItem("character_builder_datas", JSON.stringify(data));
  }
}
export function exportCharacter(skinEditor: SkinEditor, profile: SaveFormat) {
  return new Promise<string>((res, err) => {
    //    var dt = skinEditor.toPNG();
    //  var head = skinEditor.toPNGHead(true);
    fetch("", {
      method: "post",
      body: JSON.stringify({
        action: "export",
        datas: formatSendingDatas(profile),
        //  image: dt,
        //  head: head,
      }),
    }).then((r) => {
      if (r.status == 200) r.text().then(res);
      else err();
    });
  });
}
function formatSendingDatas(profile: SaveFormat) {
  var res = {
    appearance: {
      size: profile.apparence.size,
      slim: profile.apparence.slim,
      layers: [],
    },
    stats: profile.stats,
  } as any;
  //externals.forEach((v) => {
  //  let skin = profile.skin.find((v1) => v1.id == v.name);

  profile.skin.forEach((skin) => {
    console.log(skin);
    if (skin?.texture) res.appearance.layers.push({ id: skin.id, texture: skin.texture, side: skin.side });
  });

  //});
  return res;
}
export async function tryLoadResource(url: string) {
  var res = await fetch(url);
  if (res.ok) return await res.json();
  return undefined;
}
