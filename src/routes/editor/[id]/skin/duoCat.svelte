<script lang="ts">
    import { Button, Input, Label, List, TabItem, Toggle, Tooltip } from "flowbite-svelte";
    import { SkinPart, type SkinEditor } from "./panel";
    import type { SkinPartsFormat } from "./skinTypes";
    import type { ColorRepresentation } from "three";
    import { onMount } from "svelte";
    let {children,skinEditor,cat,simpleLayer,layerLeft,layerRight, titleLeft,titleRight}:{children?:any,skinEditor:SkinEditor,cat:SkinPartsFormat,simpleLayer:string,layerLeft:string,layerRight:string,titleLeft:string,titleRight:string}=$props();
    let splitted=$derived.by(()=>{
        var sameText=skinEditor?.getPickedTexture(layerLeft)==skinEditor?.getPickedTexture(layerRight);
        var sameCol=skinEditor?.getPickedColor(layerLeft)==skinEditor?.getPickedColor(layerRight);
        return !sameText || !sameCol 
    });
    function switchMode(split:boolean)
    {
        splitted=split;
        if(!splitted)
        {
            pickTexture(false,skinEditor.getPickedTexture(layerLeft));
            pickColor(false,skinEditor.getPickedColor(layerLeft));
        }
    }
    function cleanPart(isRight:boolean)
    {
        if(!splitted || !isRight)
            skinEditor.clearPart(layerLeft)
        if(!splitted || isRight)
            skinEditor.clearPart(layerRight)
    }
    function pickTexture(isRight:boolean,id:string)
    {
        if(!splitted || !isRight)
            skinEditor.pickTexture(layerLeft,id)
        if(!splitted || isRight)
            skinEditor.pickTexture(layerRight,id)
    }
    function pickColor(isRight:boolean,id:ColorRepresentation)
    {
        if(!splitted || !isRight)
            skinEditor.pickColor(layerLeft,id)
        if(!splitted || isRight)
            skinEditor.pickColor(layerRight,id)
    }
   
</script>
<TabItem title={cat.title}>
    {#each splitted?[0,1]:[0] as m }
    <p class=" text-secondary-text text-2xl">{splitted?(m==0?titleLeft:titleRight):cat.title}</p>
    {#each Object.keys(cat.cats||{"":""}) as sub}
    {#if cat.cats}
        <h2>{cat.cats[sub]}</h2>
    {/if}
    <div class="my-3">
        {#each cat.images.filter(c=>c.cat==sub || sub=="") as skin}
        {#if skin.id=="clear"}
            <Button class="ml-2 p-2 -translate-y-2" onclick={()=>cleanPart(m==1)}><img class="size-10" src="/skins/display/clear.svg" alt="Aucun"/></Button>    
            <Tooltip type="light">Aucun</Tooltip>
        {:else}
            <Button class="ml-2 p-0" onclick={()=>pickTexture(m==1,skin.id)}><img class="size-14" src="/skins/display/{skinEditor.getTexturePath(simpleLayer,skin.id)}" alt={skin.name||skin.id}/> </Button>  
            {#if skin.name}  
                 <Tooltip type="light">{skin.name}</Tooltip>
            {/if}
        {/if}
        {/each}     
    </div>
    {/each}
    {#if cat.colors}
    {#if cat.colors=="free"}
    {@const col=skinEditor.getPickedColor(m==0?layerLeft:layerRight)}
    <p class="mb-2 ml=5 mt-5 text-secondary-text text-xl">Couleur:</p>
        <Input type="color" class="w-10 cursor-pointer" style="background-color:{col};" oninput={(ev)=>{ev.target.style.backgroundColor=ev.target.value; pickColor(m==1,ev.target.value)}} value={col}/>
    {:else}
    <p class="mb-2 mt-5 text-secondary-text w-full text-xl">Couleurs:</p>
        {#each cat.colors as color}
        <Button class="ml-2" outline style=" background-color:{color}"  onclick={()=>pickColor(m==1,color)} />
        {/each}
    {/if}
    {/if}
    {#if splitted && m==0}
        <hr class="border border-primary-500 my-3"/>
    {/if}
    {/each}
<div>
    <Label for="bras"  class="mb-2 ml=5 mt-5 text-secondary-text text-xl">Avancé:</Label>
    <Toggle id="bras" checked={splitted} onchange={(e)=>switchMode(e.target.checked)} class="text-secondary-text cursor-pointer"></Toggle>
    
</div>    
{@render children?.()}
</TabItem>