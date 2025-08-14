<script lang="ts">
    import { Button,  TabItem, Tooltip } from "flowbite-svelte";
    import { type SkinEditor } from "./panel";
    import type {  SkinPartsFormat } from "./skinTypes";
    import { onMount } from "svelte";
    import DrawerButton from "./DrawerButton.svelte";
    import PartButton from "./PartButton.svelte";
    let {children,skinEditor,cat,layer}:{children?:any,skinEditor:SkinEditor,cat:SkinPartsFormat,layer:string}=$props();
    let layers:number[]=$state([0]);
    function addLayer()
    {
        const l=skinEditor.skinLib.layers.find(v=>v.name==layer);
        if(l)
        {
            const ind= skinEditor.createLayer(l);
            const texture=skinEditor.getDefaultTextureFor(layer);
            if(texture)
                skinEditor.pickTexture(layer,texture,ind)
            layers.push(ind)
        }

    }
    function removeLayer(index:number)
    {
        skinEditor.removeLayer(layer,index);
        layers=layers.filter(l=>l !=index);
    }
    onMount(()=>{
        skinEditor.onLoaded(()=>{
            layers=[0];
            skinEditor.getLayersOfType(layer).forEach(v=>{
                    if(v.index!=0)
                        layers.push(v.index)
                })
            });
    })
</script>
<TabItem title={cat.title} open={layer=="base"}>
    <p class=" text-secondary-text text-2xl">{cat.title}</p>
    {#each layers as l,i }
       {#each Object.keys(cat.cats||{"":{name:"",images:cat.images}}) as subk}
        {@const sub=cat.cats?cat.cats[subk]:{name:"",images:cat.images}}
            {#if cat.cats}
                <h2>{sub.name}</h2>
            {/if}
            <div class="my-3">
                 {#if i>0}
                <div class="w-full relative">
                    <Button color="red" class="absolute right-0 top-0 py-1 px-2 cursor-pointer" onclick={()=>removeLayer(l)}>X</Button>
                    <Tooltip type="light">Supprimer la couche</Tooltip>
                </div>
                {/if}
                {#if sub.images}
                    {#each sub.images as skin}
                        {#if skin.subs }
                            <DrawerButton category={subk} {layer} {skinEditor} index={l} texture={skin} onclick={(sub)=>skinEditor.pickTexture(layer,{subs:skin.id,category:subk,id:sub.id},l)} />
                        {:else}
                            <PartButton {layer} category={subk} {skinEditor} index={l} texture={skin} onclear={()=>skinEditor.clearPart(layer,l)} onclick={()=>skinEditor.pickTexture(layer,{id:skin.id,subs:subk},l)}/>
                        {/if}
                    {/each}     
                {/if}
            </div>
        {/each}
    {/each}
    <Button class="mt-2 cursor-pointer" onclick={addLayer}>+</Button>
    <Tooltip type="light">Ajouter une couche</Tooltip>
    {@render children?.()}
</TabItem>