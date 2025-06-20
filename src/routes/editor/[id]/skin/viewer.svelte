<script lang="ts">
    import { browser } from "$app/environment";
    import * as skinViewer from "$lib/skinviewer3d/skinview3d";
    import { onMount } from "svelte";
    import { layers } from "./panel";
    var canvas: HTMLCanvasElement;
    let {viewer=$bindable()}:{viewer:skinViewer.SkinViewer}=$props()
    onMount(() => {
        if (browser) {
            var h=400;
            viewer = new skinViewer.SkinViewer({
                canvas,
                width: h,
                height:h,
                layers
            });
            var resizeObserver:ResizeObserver;
            if( canvas?.parentElement)
            {
                resizeObserver = new ResizeObserver(() => {
                  
                    if(canvas?.parentElement)
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
                        viewer.setSize(h,h)
                    }
                } );
                resizeObserver.observe(canvas.parentElement);
            }            
            viewer.animation = new skinViewer.WalkingAnimation();
            viewer.animation.speed=0.2;
            return ()=>{
                resizeObserver?.disconnect();
                viewer?.dispose();
            }
            
        }
    });
</script>

<canvas bind:this={canvas} class="cursor-pointer" onmouseenter={()=>{
    if(viewer)
        viewer.animation= new skinViewer.IdleAnimation();
    
}} onmouseleave={()=>{
    if(viewer)
    {
    viewer.animation= new skinViewer.WalkingAnimation();
    viewer.animation.speed=0.2;
    }
}}></canvas>

