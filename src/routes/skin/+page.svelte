<script lang="ts">
    import Viewer from "./viewer.svelte";
    import type { PageData } from './$types';
    export let data:PageData;
    import type {SkinViewer} from "$lib/skinviewer3d/skinview3d";
    import PanelLeft from "./panel_left.svelte";
    import { Button } from "flowbite-svelte";
    import { SHARED } from "$lib/sharedDatas";
    import type { ColorRepresentation } from "three";
    import type { eyeType } from "$lib/skinviewer3d/colorHelper";
    var viewer:SkinViewer
    var exportFn: ()=>string;
    var getSkinDatas: ()=>{[key:string]:{texture?:string,color?:ColorRepresentation,type?:eyeType}};
    $SHARED.title="Skin Maker"
    function exportSkin()
    {
        var dt=exportFn();
       
        fetch("",{method:"post", body:JSON.stringify({
            datas:sanitizedDatas(),
            image:dt       
    })}).then(r=>{
        if(r.status==200)
            r.text().then(window.alert)
    })
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
</script>

<div class="w-full h-full">
    <div class="flex w-full h-5/6">
        <div class="w-2/6 mr-5">
        <PanelLeft data={data.datas} {viewer} bind:getSkinDatas={getSkinDatas}/>
        </div>
        <div class="rounded-md bgimg flex grow justify-center">
            <Viewer bind:viewer={viewer} bind:createSkin={exportFn} />
        </div>
        <div class="w-1/6 ml-5">
            <Button on:click={exportSkin}>Export</Button>
        </div>
    </div>
</div>
<style>
.bgimg{
    background-image: url("/images/skin_bg.png");
    background-size: auto 100%;
    background-repeat: no-repeat;
    background-position: center;
}
</style>
