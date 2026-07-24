<script lang="ts">
    import { Button, TabItem, Tooltip, Tabs } from "flowbite-svelte";
    import { type SkinEditor } from "./panel";
    import type { SkinPartsFormat } from "./skinTypes";
    import { onMount } from "svelte";
    import DrawerButton from "./DrawerButton.svelte";
    import PartButton from "./PartButton.svelte";
    let { children, skinEditor, cat, layer }: { children?: any; skinEditor: SkinEditor; cat: SkinPartsFormat; layer: string } = $props();
    let layers: number[] = $state([0]);
    let firstLoad = $state(true);
    function addLayer() {
        firstLoad = false;
        const l = skinEditor.skinLib.layers.find((v) => v.name == layer);
        if (l) {
            const ind = skinEditor.createLayer(l);
            const texture = skinEditor.getDefaultTextureFor(layer);
            if (texture) skinEditor.pickTexture(layer, texture, ind);
            layers.push(ind);
        }
    }
    function removeLayer(index: number) {
        skinEditor.removeLayer(layer, index);
        layers = layers.filter((l) => l != index);
    }
    onMount(() => {
        skinEditor.onLoaded(() => {
            layers = [0];
            skinEditor.getLayersOfType(layer).forEach((v) => {
                if (v.index != 0) layers.push(v.index);
            });
        });
    });
</script>

<TabItem title={cat.title} open={layer == "base"}>
    <p class=" text-secondary-text text-2xl">{cat.title}</p>
    <Tabs>
        {#key layers}
            {#each layers as l, i}
                <TabItem title={i + 1} open={firstLoad ? i == 0 : i == layers.length - 1}>
                    {#each Object.keys(cat.cats || { "": { name: "", images: cat.images } }) as subk, i1}
                        {@const sub = cat.cats ? cat.cats[subk] : { name: "", images: cat.images }}
                        {#if cat.cats}
                            <h2>{sub.name}</h2>
                        {/if}
                        <div class="my-3">
                            {#if i > 0 && i1 == 0}
                                <div class="w-full relative">
                                    <Button color="red" class="absolute right-0 top-0 py-1 px-2 cursor-pointer" onclick={() => removeLayer(l)}>X</Button>
                                    <Tooltip type="light">Supprimer la couche</Tooltip>
                                </div>
                            {/if}
                            {#if sub.images}
                                {#each sub.images as skin}
                                    {#if skin.subs}
                                        <DrawerButton category={subk} {layer} {skinEditor} index={l} texture={skin} onclick={(sub) => skinEditor.pickTexture(layer, { subs: skin.id, category: subk, id: sub.id }, l)} />
                                    {:else}
                                        <PartButton {layer} category={subk} {skinEditor} index={l} texture={skin} onclear={() => skinEditor.clearPart(layer, l)} onclick={() => skinEditor.pickTexture(layer, { id: skin.id, subs: subk }, l)} />
                                    {/if}
                                {/each}
                            {/if}
                        </div>
                    {/each}
                </TabItem>
                <Tooltip type="light">Couche {i + 1}</Tooltip>
            {/each}
        {/key}
        <TabItem title="+" onclick={addLayer} inactiveClass=" nline-block text-sm font-medium text-center cursor-pointer p-4 hover:text-gray-100 rounded-4xl text-secondary-text bg-gray-50 hover:bg-secondary-text dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300" />
        <Tooltip type="light">Ajouter une couche</Tooltip>
    </Tabs>
    {@render children?.()}
</TabItem>
