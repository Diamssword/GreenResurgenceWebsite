<script lang="ts"> 
    import * as skinViewer from "$lib/skinviewer3d/skinview3d";
    import { onMount } from "svelte";
    var canvas: HTMLCanvasElement;
    export var viewer: skinViewer.SkinViewer;
    import type { PageData } from './$types';
    import { browser } from '$app/environment';
    import { Button, Range } from "flowbite-svelte";
    import type { SkinLayersFormat, TextureInfos } from "../../editor/[id]/skin/skinTypes";
    import { setSkinSize } from "$lib/skinviewer3d/textureHelper";
    import { BASE } from "../../editor/[id]/skin/panel";
    let {data}:{data:PageData}=$props();
    const size=128;
    const layers:skinViewer.LayerInfo[]=[{name:"head",size:0},{name:"base",size:0},{name:"main",size:0.05,external:false}]
    const settings={
        "bodyfull":{x:-30.75,y:-4.08,z:27.87,o:0},
        "body":{x:-30.75,y:-4.08,z:27.87,o:0},
        "head":{x:-10.04,y:3.88,z:16.76,o:-11},
        "headfull":{x:-10.04,y:3.88,z:16.76,o:-11},
        "headlong":{x: -14.88, y: 5.75, z: 24.85,o:-6},
        "face":{x:0,y:0,z:14.83,o:-12},
        
    }
    onMount(() => {
        if (browser) {
            setSkinSize((data.layers.find(v=>v.name==BASE) as any).skinRes)
            viewer = new skinViewer.SkinViewer({
                canvas,
                width: size,
                height:size,
                layers,
                preserveDrawingBuffer:true
            });     
                viewer.controls.addEventListener("change",()=>{
                    console.log("cam:",viewer.camera.position);
                    console.log("offset:",height);
                })
            window.setViewer=(set:any)=>{
                viewer.camera.position.set(set.x,set.y,set.z);
                viewer.playerObject.position.set(viewer.playerObject.position.x,set.o,viewer.playerObject.position.z)
            }
        }

    });
    async function start()
    {
        for(let l of data.layers)
        {
            var dts=data.datas[l.name];
            if(dts.cats)
            {
                for(let k of Object.keys(dts.cats))
                {
                    await genForGroup(l.name,dts.cats[k].images,l.cats[k].displayGen||l.displayGen||"body",k)
                }
            }
            else if(dts.images)
            {
                await genForGroup(l.name,dts.images,l.displayGen||"body")
            }
        }
    }
    async function genForGroup(layer:string,images:TextureInfos[],type:SkinLayersFormat["displayGen"],cat?:string)
    {
        const base=cat?cat:"";

        for(let img of images)
        {
            if(img.subs)   
            {
                await genForType(layer,img.subs,type,base+"/"+img.id);  
            }
            else
                await genForType(layer,[img],type,base);  
        }
    }
    function loadBase()
    {
        viewer.loadSkin("base","/skins/body.png");
    }
      function loadHead()
    {
        viewer.loadSkin("head","/skins/head.png");
    }
    async function genForType(layer:string,images:TextureInfos[],type:SkinLayersFormat["displayGen"],parent?:string)
    {
        var needHead=type=="headfull"|| type=="face" || type=="headlong";
        viewer.loadSkin("head",needHead?"/skins/head.png":"/skins/clear.png");
        viewer.loadSkin("base",type=="bodyfull"?"/skins/body.png":"/skins/clear.png");
        var set=settings[type||"body"];
        viewer.camera.position.set(set.x,set.y,set.z);
          viewer.playerObject.position.set(viewer.playerObject.position.x,set.o,viewer.playerObject.position.z)
        //viewer.controls.target
        for(let img of images)
        {
            const p1=img.id;
            if(p1 !="clear")
            {
                let l=layer+"/";
                if(parent)
                l=l+parent+"/"
                await loadOne("/datas/skins/"+l+p1+".png",l+p1);
            }
        }
    }
    function loadOne(url:string,id:string)
    {
        viewer.loadSkin("main",url);
        setTimeout(()=>{
            fetch("",{method:"post", body:JSON.stringify({id,image:canvas.toDataURL("png")})});
        },200)
        return new Promise<void>(res=>{
            setTimeout(res,300);
        })
    }
    var height=$state(0);
    $effect(()=>{
        console.log("heigt:",height)
        viewer.playerObject.position.set(viewer.playerObject.position.x,height,viewer.playerObject.position.z)
    });
</script>
<div class="flex">
<canvas class="bg-gray-700"  bind:this={canvas}></canvas>
<Button onclick={()=>loadBase()}>Load Body</Button>
<Button onclick={()=>loadHead()}>Load Head</Button>
<Button onclick={()=>start()}>Start</Button>
<Range bind:value={height} min="-50" max=50 />
</div>