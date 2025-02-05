<script lang="ts">
    import Viewer from "./viewer.svelte";
    import type { PageData } from '../$types';
    export let data:PageData;
    import type {SkinViewer} from "$lib/skinviewer3d/skinview3d";
    import PanelLeft from "./panel_left.svelte";
    import PanelRight from "./panel_right.svelte";
    import { Alert, Button } from "flowbite-svelte";
    import { SHARED } from "$lib/sharedDatas";
    import type { ColorRepresentation } from "three";
    import type { eyeType } from "$lib/skinviewer3d/textureHelper";
    import { fade } from "svelte/transition";
    import { browser } from "$app/environment";
    var viewer:SkinViewer
    var exportFn: (allLayers?:boolean)=>string;
    var ldSkinFn:(dt:any)=>void;
    var getSkinDatas: ()=>{[key:string]:{texture?:string,color?:ColorRepresentation,type?:eyeType}};
    $SHARED.title="Customiseur"
    function exportSkin(profile:any)
    {
        return new Promise((res,err)=>{
            var dt=exportFn();
                fetch("",{method:"post", body:JSON.stringify({
                    datas:{...sanitizedDatas(),...profile},
                    image:dt       
            })}).then(r=>{
                if(r.status==200)
                    r.text().then(res)
                else
                err();
            })
        });
       
    }
    function sanitizedDatas()
    {
        var js=getSkinDatas();
        var res= {
            hair:js["hair"].texture,
            hairColor:js["hair"].color?.toString().replace("#",""),
            eyeType:js["eyes"].type,
            underwear:js["underwear"].texture
        } as any
        if(js["beard"] && js["beard"].texture !="clear")
        {
            res.beard=js["beard"].texture;
            res.beardColor=js["beard"].color?.toString().replace("#","");
        }
        return res;
    }
    var infos=["L'affichage de certains élèments (notament les couleurs) peut differer légèrement en jeu. ","Pour garder une sauvgarde de votre skin, utilisez l'option \"Sauvegarder mes paramètres\"","Vous pouvez télécharger votre skin pour l'utilser ailleurs!","Ça va vous sinon?"]
    var pickedInfo=0;
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
        <div class="w-2/6 mr-5">
        <PanelLeft data={data.datas} {viewer} bind:getSkinDatas={getSkinDatas} bind:loadDefault={ldSkinFn}/>
        </div>
        <div class="rounded-md bgimg flex grow justify-center">
            <Viewer bind:viewer={viewer} bind:createSkin={exportFn} />
        </div>
        <div class="w-1/5 ml-5 ">
            <PanelRight data={data.datas} {viewer} imgFunction={exportFn} dtFn={getSkinDatas} ldSkinFn={ldSkinFn} exptFn={exportSkin}/>
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
