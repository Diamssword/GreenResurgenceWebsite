import ShortUniqueId from "short-unique-id";
import type { RequestHandler } from "./$types";
import * as fs from "fs";
import dayjs from "dayjs";
import { error, json } from "@sveltejs/kit";
import { skin_datas } from "$lib/server_functions";
import db from "$lib/DB";
import type { PickedTextureInfos, SaveFormat } from "./skin/skinTypes";
import { layers } from "$lib/layers_visitor";
const uid = new ShortUniqueId({ length: 6 });

export const POST: RequestHandler = async (ev) => {
  if (ev.locals.user_ip) {
    var dt = await ev.request.json();
    if (dt.action == "export" && dt.datas /* && dt.image && dt.head*/) {
      var code = uid.rnd();
      if (skin_datas[ev.locals.user_ip]) {
        fs.rmSync("./uploaded/cache/" + skin_datas[ev.locals.user_ip].code + ".json");
      }
      skin_datas[ev.locals.user_ip] = { code, expire: dayjs().add(1, "m") };
      fs.writeFileSync("./uploaded/cache/" + code + ".json", JSON.stringify({ ...sanitizeData(dt.datas) /*,base64Skin:dt.image.replace('data:image/png;base64,', ''),base64SkinHead:dt.head.replace('data:image/png;base64,', '')*/ }));
      return new Response(code);
    } else if (ev.locals.user?.id && dt.action == "save" && dt.sheet && dt.datas) {
      var d = db.prepare("UPDATE skinlayout SET data = ?, edit_at = ? WHERE user_id=  (SELECT id FROM user WHERE id = ?) AND id = ?").run(JSON.stringify(sanitizeSaveProfile(dt.datas)), new Date().toUTCString(), ev.locals.user.id, dt.sheet);
      if (d && d.changes > 0) return new Response("saved");
      return error(500, "failed");
    }
  }
  return error(403, { message: "No IP" });
};
function maxStrLength(text?: string, max: number = 300) {
  if (!text) return;
  if (text.length > max) return text.substring(0, max);
  return text;
}
function sanitizeSaveProfile(data: SaveFormat) {
  data.apparence.size = typeof data.apparence.size == "number" ? data.apparence.size : 80;
  data.apparence.slim = data.apparence.slim == true;
  data.stats = {
    firstname: maxStrLength(data.stats?.firstname || "Jean", 128),
    lastname: maxStrLength(data.stats?.lastname || "Fète", 128),
    faction: maxStrLength(data.stats?.faction || "cites_emeraude", 100),
    origine: maxStrLength(data.stats?.origine || "n_granda", 100),
    job: maxStrLength(data.stats?.job || "electron_libre", 100),
    age: data.stats.age,
    points: data.stats?.points,
  };
  return data;
}
function sanitizeData(data: { stats: any; appearance: { size: number; slim: boolean; layers: { id: string; texture: PickedTextureInfos; side?: "left" | "right" }[] } }) {
  const b = {
    appearance: {
      layers: [] as SanitizedTexture[],
      size: maxStrLength(data.appearance?.size || 67, 2),
      slim: data.appearance?.slim == true ? true : false,
    },
    stats: {
      firstname: maxStrLength(data.stats?.firstname || "Jean", 128),
      lastname: maxStrLength(data.stats?.lastname || "Fète", 128),
      faction: maxStrLength(data.stats?.faction || "cites_emeraude", 100),
      origine: maxStrLength(data.stats?.origine || "n_granda", 100),
      job: maxStrLength(data.stats?.job || "electron_libre", 100),
      points: data.stats?.points,
    },
  };

  layers.forEach((l) => {
    let found = data.appearance.layers.filter((a) => a.id == l.name);
    console.log(found)
    if (l.multi) {
      found.forEach((l1) => {
        b.appearance.layers.push(formatTexture(l.name, l1.texture, l1.side));
      });
    } else if (l.splited) {
      let left = found.find((p) => p.side == "left");
      let right = found.find((p) => p.side == "right");
      if (!right) right = left;
      else if (!left) left = right;
      console.log(left);
      console.log(right);
      if (left && right) {
        b.appearance.layers.push(formatTexture(l.name, left.texture, "left"), formatTexture(l.name, right.texture, "right"));
      }
    } else if (found.length > 0) b.appearance.layers.push(formatTexture(l.name, found[0].texture));
  });
  return b;
}
type SanitizedTexture = { layer: string; id: string; category?: string; parent?: string; side?: "left" | "right" };

function formatTexture(layer: string, texture: PickedTextureInfos, side?: "left" | "right") {
  return { layer: maxStrLength(layer), id: maxStrLength(texture.id, 500), category: maxStrLength(texture.category), parent: maxStrLength(texture.subs), side } as SanitizedTexture;
}
setInterval(() => {
  for (var k in skin_datas) {
    if (skin_datas[k].expire.isBefore(dayjs())) {
      var code = skin_datas[k].code;
      delete skin_datas[k];
      if (fs.existsSync("./uploaded/cache/" + code + ".png")) fs.rmSync("./uploaded/cache/" + code + ".png");
      if (fs.existsSync("./uploaded/cache/" + code + "_head.png")) fs.rmSync("./uploaded/cache/" + code + "_head.png");
      if (fs.existsSync("./uploaded/cache/" + code + ".json")) fs.rmSync("./uploaded/cache/" + code + ".json");
    }
  }
}, 5000);
