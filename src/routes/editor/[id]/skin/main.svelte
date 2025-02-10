<script lang="ts">
    import Viewer from "./viewer.svelte";
    import type { PageData } from '../$types';
    import type {SkinViewer} from "$lib/skinviewer3d/skinview3d";
    import PanelLeft from "./panel_left.svelte";
    import PanelRight from "./panel_right.svelte";
    import { Alert } from "flowbite-svelte";
    import { SHARED } from "$lib/sharedDatas";
    import type { ColorRepresentation } from "three";
    import type { eyeType } from "$lib/skinviewer3d/textureHelper";
    import { fade } from "svelte/transition";
    import { browser } from "$app/environment";
    import { localLoader, localSaver, SkinEditor } from "./panel";1
    import type { SaveFormat } from "./skinTypes";
    import { onMount } from "svelte";
    let {data}:{data:PageData}=$props();
    var viewer:SkinViewer=$state();
    var skinEditor= new SkinEditor(data.datas);
    var currentAppearence=$state({skin:{},stats:{},apparence:{}} as SaveFormat);
    var ldExtra: (slim: boolean, taille: number) => void=$state();
    var getSkinDatas: ()=>{[key:string]:{texture?:string,color?:ColorRepresentation,type?:eyeType}};
    var defaultLoader=localLoader;
    var defaultSaver=localSaver;
    $SHARED.title="Customiseur"
    function onPhysicChange(slim:boolean,size:number)
    {
        if(viewer)
        {
            currentAppearence.apparence={size,slim};
            defaultSaver(currentAppearence);
            setTimeout(() => {
                viewer.playerObject.forLayers(l=>l.modelType=(slim?"slim":"default"));    
            }, 100);
            size=100+size
            skinEditor.slim=slim;
            viewer.playerObject.scale.set(size/200,size/200,size/200)
        }
    }
  
    var loaded=false;
    onMount(()=>{
        if(viewer && !loaded)
        {
            loaded=true;
            if(browser)
            {
                currentAppearence=defaultLoader();
                skinEditor.viewer=viewer;
               skinEditor.loadSavedOrDefault(currentAppearence.skin)
               ldExtra(currentAppearence.apparence?.slim,currentAppearence.apparence?.size||67);
                skinEditor.saveFn=(dt)=>{
                    currentAppearence.skin=dt;
                    defaultSaver(currentAppearence);
                }
                
            }
        }
    });
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
        <PanelLeft data={data.datas} {skinEditor} onExtra={onPhysicChange} bind:setExtra={ldExtra} />
        </div>
        <div class="rounded-md bgimg flex grow justify-center">
            <Viewer bind:viewer={viewer}/>
        </div>
       <div class="w-1/6 ml-5 max-h-[65vh]">
        <PanelRight editor={skinEditor} currentSave={currentAppearence} changePhysicFn={onPhysicChange}/>
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
