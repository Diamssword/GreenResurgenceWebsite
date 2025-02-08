<script lang="ts">
    import { AccordionItem, Accordion, Button, Input, Tooltip, Tabs, TabItem, Label, Toggle } from 'flowbite-svelte'; 
    import type { PageData } from '../$types';
    import {SkinViewer} from "$lib/skinviewer3d/skinview3d";
    import type { ColorRepresentation } from 'three';
    import { browser } from '$app/environment';
    import type { eyeType } from '$lib/skinviewer3d/textureHelper';
    import { SkinEditor, SkinPart } from './panel';
    import SimpleCat from './simpleCat.svelte';
    import DuoCat from './duoCat.svelte';
    var {data,viewer,getSkinData=$bindable(),loadDefault=$bindable()} :{data:PageData["datas"],viewer:SkinViewer,loadDefault:(saved:any)=>void, getSkinData:()=>{[key:string]:{texture?:string,color?:ColorRepresentation,type?:eyeType}}} = $props();
    var taille:number=$state(0);
    var slim=$state(false);
    var skinEditor= new SkinEditor(data,viewer);
    getSkinData=()=>
    {
        
        var res:{[key:string]:{texture?:string,color?:ColorRepresentation}}={};
        for(const k in skinEditor.pickedLayers)
            res[k]=skinEditor.pickedLayers[k];       
        return res;
    }
    function saveTemp()
    {
        if(browser)
        {
            window.localStorage.setItem("skin_builder_datas",JSON.stringify(toJson()))
        }
    }
  
    var loaded=false;
    $effect(()=>{
        if(viewer && !loaded)
        {
            loaded=true;
            if(browser)
            {
                skinEditor.viewer=viewer;
                skinEditor.loadSavedOrDefault(JSON.parse(window.localStorage.getItem("skin_builder_datas")||"{}"))
            }
        }
    });
   
    export function toJson()
    {
        var res:{[key:string]:{texture:string,color?:string}}={};
        for( let k in skinEditor.pickedLayers)
        {
            res[k]=skinEditor.pickedLayers[k];
        }
        return res;
        
    }
    export function fromJson(json:any)
    {
        skinEditor.loadSavedOrDefault(json);
    }
    function getAllInSub(sub:string,images:typeof data[""]["images"])
    {
        if(sub=="")
            return images;
        var res=[];
        for(var d in images)
        {
            if(images[d].cat==sub)
                res.push(images[d]);
        }
        return res;
    }
  </script>
  <div class="h-full overflow-auto">
    <Tabs contentClass="p-4 rounded-lg dark:bg-gray-800 mt-4 bg-primary-300">
        <SimpleCat cat={data[SkinPart.base]} layer={SkinPart.base} {skinEditor}>
            <div class="grid gap-6 mb-6 md:grid-cols-2">
                <div>
                    <Label for="taille"  class="mb-2 ml=5 mt-5 text-secondary-text text-xl" >Taille:</Label>
                    <div class=" flex">
                        <p class=" content-center mr-1">1m</p>
                        <Input class="w-22" type="number" min=40 max=99 id="taille" placeholder={Math.floor(40+(Math.random()*45))} required  bind:value={taille}/>
                    </div>
            
                </div>
                <div>
                    <Label for="bras"  class="mb-2 ml=5 mt-5 text-secondary-text text-xl">Bras fins:</Label>
                    <Toggle id="bras" checked={slim} on:change={(e)=>{slim=e.target.checked}} class="text-secondary-text cursor-pointer"></Toggle>
                    
                </div>    
           </div>
        </SimpleCat>
        <SimpleCat cat={data[SkinPart.underwear]} layer={SkinPart.underwear} {skinEditor}/>
        <SimpleCat cat={data[SkinPart.hair]} layer={SkinPart.hair} {skinEditor}/>
        <DuoCat cat={data["eyes"]} simpleLayer={"eyes"} layerLeft={SkinPart.left_eye} layerRight={SkinPart.right_eye} titleLeft="Oeil Gauche" titleRight="Oeil Droit" {skinEditor}/>
        <SimpleCat cat={data[SkinPart.cosmetic]} layer={SkinPart.cosmetic} {skinEditor}/>
        <SimpleCat cat={data[SkinPart.mouth]} layer={SkinPart.mouth} {skinEditor}/>
        <SimpleCat cat={data[SkinPart.beard]} layer={SkinPart.beard} {skinEditor}/>
    </Tabs>
  
</div>