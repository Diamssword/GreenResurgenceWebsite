<script lang="ts">
    import Viewer from "./viewer.svelte";
    import type { PageData } from '../$types';
    import type {SkinViewer} from "$lib/skinviewer3d/skinview3d";
    import PanelLeft from "./panel_left.svelte";
    import PanelRight from "./panel_right.svelte";
    import { Alert } from "flowbite-svelte";
    import { SHARED } from "$lib/sharedDatas";
    import { fade } from "svelte/transition";
    import { browser } from "$app/environment";
    import {  SkinEditor } from "./panel";
    import type { SaveFormat, SkinLayersFormat, SkinParts } from "./skinTypes";
    import { onMount } from "svelte";
    import { currentAppearence } from "../shared.svelte";
    let {data,dataSaver,canExport}:{data:{datas:SkinParts,layers:SkinLayersFormat[],hasStats:boolean }, dataSaver: {loader:()=>SaveFormat,saver:(data:SaveFormat)=>void},canExport:boolean }=$props();
    let viewer:SkinViewer=$state(undefined as any);
    let skinEditor= new SkinEditor(data);
    $SHARED.title="Customiseur"
    function onPhysicChange(slim:boolean,size:number)
    {
        if(viewer)
        {
            currentAppearence.data.apparence={size,slim};
            dataSaver.saver(currentAppearence.data);
            viewer.playerObject.forLayers(l=>l.modelType=(slim?"slim":"default"));    
            size=100+size
            skinEditor.slim=slim;
            viewer.playerObject.scale.set(size/200,size/200,size/200)
        }
    }
    function onloaded(){
        if(viewer && currentAppearence.isLoaded)
        {
            skinEditor.slim=currentAppearence.data.apparence?.slim||false;
            skinEditor.setViewer(viewer);
            skinEditor.loadSavedOrDefault(currentAppearence.data.skin)
            skinEditor.saveFn=(dt)=>{
                currentAppearence.data.skin=dt;
                dataSaver.saver(currentAppearence.data);
            }
        }
    }

    currentAppearence.listeners.push(onloaded);
    onMount(onloaded)
    var infos=["L'affichage de certains élèments (notament les couleurs) peut differer légèrement en jeu. ","Pour garder une sauvgarde de votre skin, utilisez l'option \"Sauvegarder mes paramètres\"","Vous pouvez télécharger votre skin pour l'utilser ailleurs!","Ça va vous sinon?"]
    var pickedInfo=$state(0);
    if(browser)
    {
        setInterval(()=>{
            var p=Math.floor(Math.random()*infos.length);
            if(p==pickedInfo)
                p=Math.floor(Math.random()*infos.length);
            pickedInfo=p;
        },7000)
    }
</script>
<div class="w-full flex-1 p-2">
    <div class="flex w-full mb-5 rounded-md">
        <div class="w-3/6 mr-5 max-h-[65vh]">
        <PanelLeft data={data} {skinEditor} {dataSaver} onExtra={onPhysicChange}  />
        </div>
        <div class="rounded-md bgimg flex w-2/6 justify-center items-center">
            <Viewer bind:viewer={viewer}/>
        </div>
       <div class="w-1/6 ml-5 max-h-[65vh]">
        <PanelRight {canExport} editor={skinEditor} changePhysicFn={onPhysicChange} sheetName={data.sheet?.name}/>
       </div>
    </div>
    <Alert color="blue">
        {#key pickedInfo}
        <p in:fade={{duration:1000}}>{infos[pickedInfo]}</p>    
        {/key}
    </Alert>
</div>
<style>
.bgimg{
    background-image: url("/images/skin_bg.png");
    background-size: auto 100%;
    background-repeat: no-repeat;
    background-position: center;
}
</style>
