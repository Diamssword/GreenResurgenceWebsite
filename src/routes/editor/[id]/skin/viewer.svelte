<script lang="ts">
    import { browser } from "$app/environment";
    import * as skinViewer from "$lib/skinviewer3d/skinview3d";
    import { onMount } from "svelte";
    import { layers } from "./panel";
    var canvas: HTMLCanvasElement;
    export var viewer: skinViewer.SkinViewer;
    export function createSkin(allLayers?:boolean)
    {
        var canv=document.createElement("canvas")
        canv.width=canv.height=128;
        var ctx=canv.getContext("2d");
        layers.forEach(l=>{
            if(l.external !=true || allLayers ==true)
            {
                var c1=viewer.skinCanvas[l.name];
                ctx?.drawImage(c1,0,0);
            }
        });
        ctx?.save();
        return canv.toDataURL("png");
    }
    onMount(() => {
        if (browser) {
            var h=400;
            viewer = new skinViewer.SkinViewer({
                canvas,
                width: h,
                height:h,
                layers
            });
            if( canvas?.parentElement)
            {
                const resizeObserver = new ResizeObserver(() => {
                  
                    if(canvas.parentElement)
                    {
                       var maxH=window.innerHeight;
                       var top=canvas.getBoundingClientRect().top;
                       var nh=90;
                       var nav=document.getElementById("mainnav");
                       if(nav)
                       {
                        nh=nav.getBoundingClientRect().top+nav.getBoundingClientRect().height;
                       }
                        h=Math.max(maxH-top-nh-10,0);
                        console.log(nh)
                        viewer.setSize(h,h)
                    }
                } );
                resizeObserver.observe(canvas.parentElement);
            }            
            viewer.animation = new skinViewer.WalkingAnimation();
            viewer.animation.speed=0.2;
            
        }
    });
</script>

<canvas bind:this={canvas} class="cursor-pointer" on:mouseenter={()=>{
    if(viewer)
        viewer.animation= new skinViewer.IdleAnimation();
    
}} on:mouseleave={()=>{
    if(viewer)
    {
    viewer.animation= new skinViewer.WalkingAnimation();
    viewer.animation.speed=0.2;
    }
}}></canvas>

