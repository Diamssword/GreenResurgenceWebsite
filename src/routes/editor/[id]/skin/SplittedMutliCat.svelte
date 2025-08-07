<script lang="ts">
    import { Button, Input, Label, TabItem, Toggle, Tooltip } from "flowbite-svelte";
    import { type SkinEditor } from "./panel";
    import type { PickedTextureInfos, SkinPartsFormat } from "./skinTypes";
    import type { LayerInfo } from "$lib/skinviewer3d/model";
    import { onMount } from "svelte";
    import DrawerButton from "./DrawerButton.svelte";
    import PartButton from "./PartButton.svelte";
    let {children,skinEditor,cat,layer}:{children?:any,skinEditor:SkinEditor,cat:SkinPartsFormat,layer:string}=$props();
    let layers:number[]=$state([0,1]);
     let splitted=$derived.by(()=>{
        if(!multiLayerEnabled())
            return !isSameTexture(0)
        else
        {
            for(let i=0;i<layers.length;i+=2)
                if(!isSameTexture(i))
                    return true;
            return false;
        }
    });
    function isSameTexture(index:number)
    {
        if(skinEditor)
        {
          let a=skinEditor.getPickedTexture(layer,index);
          let b=skinEditor.getPickedTexture(layer,index+1);
          return a?.category==b?.category && a?.id==b?.id && a?.subs==b?.subs;
        }
        return false;
         
    }
    function multiLayerEnabled()
    {
        if(skinEditor && skinEditor.skinLib)
        {
            return skinEditor.skinLib.layers.find(v=>v.name==layer)?.multi
        }
        return false
    }
    function switchMode(split:boolean)
    {
        splitted=split;
        if(!splitted)
        {
            var lays=skinEditor.getLayersOfType(layer);
            for(let i=0;i<lays.length;i+=2)
            {
                const t=lays[i].texture;
                if(t)
                    skinEditor.pickTexture(layer, t,i+1)
                else
                    skinEditor.clearPart(layer, i+1)
            }
         //   pickTexture(false,skinEditor.getPickedTexture(layerLeft));
          //  pickColor(false,skinEditor.getPickedColor(layerLeft));
        }
    }
    function pickTexture(layer:string,index:number,texture?:PickedTextureInfos)
    {
        if(splitted)
        {
            if(texture)
                skinEditor.pickTexture(layer,texture,index)
            else
            skinEditor.clearPart(layer,index)
        }
        else
        {
              if(texture)
              {
                skinEditor.pickTexture(layer,texture,index)
                skinEditor.pickTexture(layer,texture,index+1)
              }
            else
            {
            skinEditor.clearPart(layer,index)
            skinEditor.clearPart(layer,index+1)
            }
        }
    }
    function addLayer()
    {
        const l=skinEditor.skinLib.layers.find(v=>v.name==layer);
        if(l)
        {
            const ind= skinEditor.createLayer(l,"left");
            const ind1= skinEditor.createLayer(l,"right");
            const texture=skinEditor.getDefaultTextureFor(layer);
            if(texture)
            {   
                skinEditor.pickTexture(layer,texture,ind)
                skinEditor.pickTexture(layer,texture,ind1)
            }
            layers.push(ind)
            layers.push(ind1)
        }

    }
    function removeLayer(index:number)
    {
        skinEditor.removeLayer(layer,index);
        skinEditor.removeLayer(layer,index+1);
        layers=layers.filter(l=>l !=index && l!=index+1);
    }
    onMount(()=>{
        skinEditor.onLoaded(()=>{
            layers=[];
            skinEditor.getLayersOfType(layer).forEach(v=>{
                layers.push(v.index)
            })
        });
    })
</script>
<TabItem title={cat.title} open={layer=="base"}>
    <p class=" text-secondary-text text-2xl">{cat.title}</p>
    <div class="my-4 flex">
        <Label for="bras" class="cursor-pointer text-secondary-text text-lg mr-2">Avancé:</Label>
        <Toggle id="bras" checked={splitted} onchange={(e)=>switchMode(e.target.checked)} class="text-secondary-text cursor-pointer"></Toggle>
    </div>  
    {#each layers as l,i }
        {#if i%2==0 && i>0}
             <hr class="border border-primary-700 my-3"/>
               <div class="w-full relative my-5">
                    <Button color="red" class="absolute right-0 -top-4.5 py-1 px-2.5 cursor-pointer" onclick={()=>removeLayer(l)}>X</Button>
                    <Tooltip type="light">Supprimer la couche</Tooltip>
                </div>
        {/if}
    {#if splitted || i%2==0}
        {#if splitted}
        <h2 class="text-secondary-text">{i%2==0?"Gauche":"Droite"}</h2>
        {/if}
        <div class="border-primary-600 {cat.cats?"border-2":""} rounded-md pl-2">
            {#each Object.keys(cat.cats||{"":{name:"",images:cat.images}}) as subk}
            {@const sub=cat.cats?cat.cats[subk]:{name:"",images:cat.images}}
                {#if cat.cats}
                    <h3>{sub.name}</h3>
                {/if}
                <div class="my-3">
                    {#if sub.images}
                        {#each sub.images as skin}
                            {#if skin.subs }
                                <DrawerButton category={subk} {layer} {skinEditor} texture={skin} onclick={(sub)=>pickTexture(layer,l,{subs:skin.id,category:subk,id:sub.id})} />
                            {:else}
                                <PartButton {layer} category={subk} {skinEditor} texture={skin} onclear={()=>pickTexture(layer,l)} onclick={()=>pickTexture(layer,l,{id:skin.id,subs:subk})}/>
                            {/if}
                        {/each}     
                    {/if}
                </div>
            {/each}
        </div>
    {/if}
    {/each}
    {#if multiLayerEnabled()==true}
        <Button class="mt-2 cursor-pointer" onclick={addLayer}>+</Button>
        <Tooltip type="light">Ajouter une couche</Tooltip>
    {/if}
    {@render children?.()}
</TabItem>