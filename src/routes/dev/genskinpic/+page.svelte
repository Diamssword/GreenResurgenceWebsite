<script lang="ts"> 
    import * as skinViewer from "$lib/skinviewer3d/skinview3d";
    import { onMount } from "svelte";
    var canvas: HTMLCanvasElement;
    export var viewer: skinViewer.SkinViewer;
    import type { PageData } from './$types';
    import { browser } from '$app/environment';
    import { Button, Range } from "flowbite-svelte";
    import Slide from "flowbite-svelte/Slide.svelte";
    export let data:PageData;
    const size=128;
    const layers:skinViewer.LayerInfo[]=[
        {name:"base",size:0},{name:"underwear",size:0.1,external:true},{name:"mouth",size:0.01},{name:"beard",size:0.02,external:true},
        {name:"eyes",size:0.03},{name:"eyesc",size:0.04},{name:"cosmetic",size:0.01},{name:"brows",size:0.06},{name:"hair",size:0.07,external:true}
    ]
    onMount(() => {
        if (browser) {
            viewer = new skinViewer.SkinViewer({
                canvas,
                width: size,
                height:size,
                layers,
                preserveDrawingBuffer:true
            });          
        }

    });
    function load(layer:string)
    {
        viewer.loadSkin(layer,"/skins/"+layer+"/"+data.datas[layer].images[1].id+".png")
    }
    function startGen(layer:string)
    {
        var prog=0;
        var int=setInterval(()=>{
            var cur=data.datas[layer]?.images;
            if(prog>=cur.length)
            {
                prog=0;
                clearInterval(int);
            }
            else if(cur)
            {
                const p1=cur[prog].id;
                if(p1 !="clear")
                {
                    viewer.loadSkin(layer,"/skins/"+layer+"/"+p1+".png");
                    if(layer=="eyes")
                        viewer.loadSkin("eyesc","/skins/"+layer+"/"+p1+"b.png");
                    setTimeout(()=>{
                        fetch("",{method:"post", body:JSON.stringify({id:p1,sub:layer,image:canvas.toDataURL("png")})});
                    },200)
                }
                prog++;

            }
        },500)
    }
    var height=0;
    $:if(height)
    {
        viewer.playerObject.position.set(viewer.playerObject.position.x,height,viewer.playerObject.position.z)
    }
    var layer:string;
</script>
<div class="flex">
<canvas class="bg-gray-700"  bind:this={canvas}/>
<input type="text" bind:value={layer}>
<Button onclick={()=>load(layer)}>Load</Button>
<Button onclick={()=>startGen(layer)}>Start</Button>
<Button onclick={()=> viewer.loadSkin("base","/skins/head.png")}>Load Head</Button>
<Range bind:value={height} min="-50" max=50 />
</div>