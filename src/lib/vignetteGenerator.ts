import * as skinViewer from "$lib/skinviewer3d/skinview3d";
import * as path from "path";
import * as fs from "fs";
import type { SkinViewer } from "$lib/skinviewer3d/skinview3d";
import puppeteer from "puppeteer";
import type { SkinLayersFormat, SkinPartsFormat, TextureInfos } from "../routes/editor/[id]/skin/skinTypes";
import type { RequestEvent } from "@sveltejs/kit";

const settings = {
  bodyfull: { x: -30.75, y: -4.08, z: 27.87, o: 0 },
  body: { x: -30.75, y: -4.08, z: 27.87, o: 0 },
  head: { x: -10.04, y: 3.88, z: 16.76, o: -11 },
  headfull: { x: -10.04, y: 3.88, z: 16.76, o: -11 },
  headlong: { x: -14.88, y: 5.75, z: 24.85, o: -6 },
  face: { x: 0, y: 0, z: 14.83, o: -12 },
};
var progress = 0;
var total = 0;

export default async function create(event: RequestEvent) {
  var dt = await (await event.fetch("/datas/skin_datas.json")).json();
  var l = (await (await event.fetch("/datas/layers.json")).json()) as SkinLayersFormat[];
  var d = dt as { [key: string]: SkinPartsFormat };
  await launchBrowser(event.url.protocol + "//" + event.url.host + "/genskinpic");

  //await start(viewer, { datas: d, layers: l });
}
function sleep(time: number) {
  return new Promise((r, er) => {
    setTimeout(r, time);
  });
}
async function launchBrowser(url: string) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--use-gl=angle", "--enable-webgl", "--ignore-gpu-blocklist"],
  });

  const page = await browser.newPage();
  await page.setViewport({
    width: 400,
    height: 400,
    deviceScaleFactor: 2,
  });
  await sleep(500);
  await page.goto(url, { waitUntil: "networkidle2" });
  //await page.setContent(viewerHtml, { waitUntil: "load" });
  await page.exposeFunction("screenshot", async (id: string, url: string, progress: number, total: number) => {
    if (id && url) {
      var fold = path.dirname(id);
      if (!fs.existsSync("./datas/skins_display_temp/" + fold)) fs.mkdirSync("./datas/skins_display_temp/" + fold, { recursive: true });
      fs.writeFileSync("./datas/skins_display_temp/" + id + ".png", url.replace("data:image/png;base64,", ""), "base64");
      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
      process.stdout.write("generated vignettes:" + total + "/layer:" + progress);
    }
  });
  await page.exposeFunction("finish", async () => {
    fs.rmSync("./datas/skins_display/", { recursive: true, force: true });
    fs.renameSync("./datas/skins_display_temp", "./datas/skins_display");
    console.log("Vignette generation is done!");
  });
  console.log("Starting to generate vignettes on backend");
  await page.evaluate(async () => {
    window.start();
    //await window.createViewer("file:///absolute/path/to/skin.png");
  });
}
async function start(viewer: SkinViewer, data: { datas: { [key: string]: SkinPartsFormat }; layers: SkinLayersFormat[] }) {
  for (let l of data.layers) {
    progress++;
    currentLayer = l.name;
    var dts = data.datas[l.name];
    if (dts.cats) {
      for (let k of Object.keys(dts.cats)) {
        await genForGroup(viewer, l.name, dts.cats[k].images, l.cats[k].displayGen || l.displayGen || "body", k);
      }
    } else if (dts.images) {
      await genForGroup(viewer, l.name, dts.images, l.displayGen || "body");
    }
  }
}
async function genForGroup(viewer: SkinViewer, layer: string, images: TextureInfos[], type: SkinLayersFormat["displayGen"], cat?: string) {
  const base = cat ? cat : "";

  for (let img of images) {
    if (img.subs) {
      await genForType(viewer, layer, img.subs, type, base + "/" + img.id);
    } else await genForType(viewer, layer, [img], type, base);
  }
}
function loadBase(viewer: SkinViewer, index: number) {
  viewer.loadSkin("base", "/skins/body.png");
}
function loadHead(viewer: SkinViewer, index: number) {
  viewer.loadSkin("head", "/skins/head.png");
}
async function genForType(viewer: SkinViewer, layer: string, images: TextureInfos[], type: SkinLayersFormat["displayGen"], parent?: string) {
  for (let img of images) {
    const p1 = img.id;
    if (p1 != "clear") {
      var needHead = type == "headfull" || type == "face" || type == "headlong";
      viewer.loadSkin("head", needHead ? "/skins/head.png" : "/skins/clear.png");
      viewer.loadSkin("base", type == "bodyfull" ? "/skins/body.png" : "/skins/clear.png");
      var set = settings[type || "body"];
      viewer.camera.position.set(set.x, set.y, set.z);
      viewer.playerObject.position.set(viewer.playerObject.position.x, set.o, viewer.playerObject.position.z);
      let l = layer + "/";
      if (parent) l = l + parent + "/";
      await loadOne(viewer, "/datas/skins/" + l + p1 + ".png", l + p1);
    }
  }
}
async function loadOne(viewer: SkinViewer, url: string, id: string) {
  viewer.loadSkin("main", url);
  setTimeout(() => {
    console.log(url);
    //require("fs").writeFileSync("out.png", canvas.toBuffer("image/png"));
    // fetch("", { method: "post", body: JSON.stringify({ id, image: viewer.canvas.toDataURL("png") }) });
    total++;
  }, 1000);
  return new Promise<void>((res) => {
    setTimeout(res, 1500);
  });
}
