<script lang="ts">
    import * as skinViewer from "$lib/skinviewer3d/skinview3d";
    import { onMount } from "svelte";
    import type { PageData } from "./$types";
    import { browser } from "$app/environment";
    import { Button, Range } from "flowbite-svelte";
    import type { SkinLayersFormat, TextureInfos } from "../../editor/[id]/skin/skinTypes";
    import { setSkinSize } from "$lib/skinviewer3d/textureHelper";
    import { BASE } from "../../editor/[id]/skin/panel";
    let { data }: { data: PageData } = $props();
    var canvas: HTMLCanvasElement[] = [];
    var viewers: skinViewer.SkinViewer[] = $state([]);
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
    var currentLayer = $state("");
    var total = $state(0);
    var available: boolean[] = [];
    onMount(() => {
        if (browser) {
            setSkinSize((data.layers.find((v) => v.name == BASE) as any).skinRes);
            for (let i = 0; i < canvas.length; i++) {
                viewers[i] = new skinViewer.SkinViewer({
                    canvas: canvas[i],
                    width: size,
                    height: size,
                    layers,
                    preserveDrawingBuffer: true,
                });
                available[i] = true;
            }
            viewers[0].controls.addEventListener("change", () => {
                console.log("cam:", viewers[0].camera.position);
                console.log("offset:", height);
            });
            window.setViewer = (set: any) => {
                viewers[0].camera.position.set(set.x, set.y, set.z);
                viewers[0].playerObject.position.set(viewers[0].playerObject.position.x, set.o, viewers[0].playerObject.position.z);
            };
        }
    });
    async function start() {
        for (let l of data.layers) {
            progress++;
            currentLayer = l.name;
            var dts = data.datas[l.name];
            if (dts.cats) {
                for (let k of Object.keys(dts.cats)) {
                    await genForGroup(l.name, dts.cats[k].images, l.cats[k].displayGen || l.displayGen || "body", k);
                }
            } else if (dts.images) {
                await genForGroup(l.name, dts.images, l.displayGen || "body");
            }
        }
    }
    async function genForGroup(layer: string, images: TextureInfos[], type: SkinLayersFormat["displayGen"], cat?: string) {
        const base = cat ? cat : "";

        for (let img of images) {
            if (img.subs) {
                await genForType(layer, img.subs, type, base + "/" + img.id);
            } else await genForType(layer, [img], type, base);
        }
    }
    function loadBase(index: number) {
        viewers[index].loadSkin("base", "/skins/body.png");
    }
    function loadHead(index: number) {
        viewers[index].loadSkin("head", "/skins/head.png");
    }
    async function genForType(layer: string, images: TextureInfos[], type: SkinLayersFormat["displayGen"], parent?: string) {
        for (let img of images) {
            const p1 = img.id;
            if (p1 != "clear") {
                let index = await awaitFreeSlot();
                var needHead = type == "headfull" || type == "face" || type == "headlong";
                viewers[index].loadSkin("head", needHead ? "/skins/head.png" : "/skins/clear.png");
                viewers[index].loadSkin("base", type == "bodyfull" ? "/skins/body.png" : "/skins/clear.png");
                var set = settings[type || "body"];
                viewers[index].camera.position.set(set.x, set.y, set.z);
                viewers[index].playerObject.position.set(viewers[index].playerObject.position.x, set.o, viewers[index].playerObject.position.z);
                let l = layer + "/";
                if (parent) l = l + parent + "/";
                loadOne(index, "/datas/skins/" + l + p1 + ".png", l + p1);
            }
        }
    }
    async function awaitFreeSlot() {
        let av = available.findIndex((a) => a == true);
        if (av > -1) {
            available[av] = false;
            return av;
        } else {
            return new Promise<number>((r) => {
                setTimeout(() => awaitFreeSlot().then(r), 200);
            });
        }
    }
    async function loadOne(index: number, url: string, id: string) {
        viewers[index].loadSkin("main", url);
        setTimeout(() => {
            fetch("", { method: "post", body: JSON.stringify({ id, image: canvas[index].toDataURL("png") }) });
            total++;
            available[index] = true;
        }, 500);
        return new Promise<void>((res) => {
            setTimeout(res, 1000);
        });
    }
    var height = $state(0);
    $effect(() => {
        console.log("heigt:", height);
        viewers[0].playerObject.position.set(viewers[0].playerObject.position.x, height, viewers[0].playerObject.position.z);
    });
</script>

<div class="flex">
    <canvas class="bg-gray-700" bind:this={canvas[0]}></canvas>
    <canvas class="bg-gray-700" bind:this={canvas[1]}></canvas>
    <canvas class="bg-gray-700" bind:this={canvas[2]}></canvas>
    <canvas class="bg-gray-700" bind:this={canvas[3]}></canvas>
    <canvas class="bg-gray-700" bind:this={canvas[4]}></canvas>
    <canvas class="bg-gray-700" bind:this={canvas[5]}></canvas>
    <canvas class="bg-gray-700" bind:this={canvas[6]}></canvas>
    <canvas class="bg-gray-700" bind:this={canvas[7]}></canvas>
    <canvas class="bg-gray-700" bind:this={canvas[8]}></canvas>
    <canvas class="bg-gray-700" bind:this={canvas[9]}></canvas>
    <canvas class="bg-gray-700" bind:this={canvas[10]}></canvas>
    <Button onclick={() => loadBase(0)}>Load Body</Button>
    <Button onclick={() => loadHead(0)}>Load Head</Button>
    <Button onclick={() => start()}>Start</Button>
    <Range bind:value={height} min="-50" max="50" />
</div>
<p>Layer ({currentLayer}) {progress}/{data.layers.length}</p>
{#if total > 0}
    <p>{total} assets generated</p>
{/if}
