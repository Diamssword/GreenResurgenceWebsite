<script lang="ts">
    import * as skinViewer from "$lib/skinviewer3d/skinview3d";
    import { onMount } from "svelte";
    import type { PageData } from "./$types";
    import { browser } from "$app/environment";
    import { Button, Range } from "flowbite-svelte";
    import type { SkinLayersFormat, TextureInfos } from "../editor/[id]/skin/skinTypes";
    import { setSkinSize } from "$lib/skinviewer3d/textureHelper";
    import { BASE } from "../editor/[id]/skin/panel";
    let { data }: { data: PageData } = $props();
    var canvas: HTMLCanvasElement;
    var viewer: skinViewer.SkinViewer = $state();
    const size = 128;
    const layers: skinViewer.LayerInfo[] = [
        { name: "head", size: 0 },
        { name: "base", size: 0 },
        { name: "main", size: 0.05, external: false },
    ];
    const settings = {
        bodyfull: { x: -30.75, y: -4.08, z: 27.87, o: 0 },
        body: { x: -30.75, y: -4.08, z: 27.87, o: 0 },
        head: { x: -10.04, y: 3.88, z: 16.76, o: -11 },
        headfull: { x: -10.04, y: 3.88, z: 16.76, o: -11 },
        headlong: { x: -14.88, y: 5.75, z: 24.85, o: -6 },
        face: { x: 0, y: 0, z: 14.83, o: -12 },
    };
    var progress = $state(0);
    var total = $state(0);
    onMount(() => {
        if (browser) {
            window.start = start;
            setSkinSize((data.layers.find((v) => v.name == BASE) as any).skinRes);
            viewer = new skinViewer.SkinViewer({
                canvas: canvas,
                width: size,
                height: size,
                layers,
                preserveDrawingBuffer: true,
            });
        }
    });
    async function start() {
        for (let l of data.layers) {
            progress++;
            var dts = data.datas[l.name];
            if (dts.cats) {
                for (let k of Object.keys(dts.cats)) {
                    await genForGroup(l.name, dts.cats[k].images, l.cats[k].displayGen || l.displayGen || "body", k);
                }
            } else if (dts.images) {
                await genForGroup(l.name, dts.images, l.displayGen || "body");
            }
        }
        window.finish();
    }
    async function genForGroup(layer: string, images: TextureInfos[], type: SkinLayersFormat["displayGen"], cat?: string) {
        const base = cat ? cat : "";

        for (let img of images) {
            if (img.subs) {
                await genForType(layer, img.subs, type, base + "/" + img.id);
            } else await genForType(layer, [img], type, base);
        }
    }
    async function genForType(layer: string, images: TextureInfos[], type: SkinLayersFormat["displayGen"], parent?: string) {
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
                await loadOne("/datas/skins/" + l + p1 + ".png", l + p1);
            }
        }
    }

    async function loadOne(url: string, id: string) {
        await viewer.loadSkin("main", url);
        await viewer.waitForRender();
        window.screenshot(id, canvas.toDataURL("png"), progress, total);
        total++;
    }
</script>

<div class="flex">
    <canvas id="canvas" class="bg-gray-700" bind:this={canvas}></canvas>
</div>
