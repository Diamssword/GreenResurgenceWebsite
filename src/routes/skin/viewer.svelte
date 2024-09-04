<script lang="ts">
    import { browser } from "$app/environment";
    import * as skinViewer from "$lib/skinviewer3d/skinview3d";
    import { onMount } from "svelte";
    var canvas: HTMLCanvasElement;
    export var viewer: skinViewer.SkinViewer;
    const layers:skinViewer.LayerInfo[]=[
        {name:"base",size:0},{name:"underwear",size:0.1,external:true},{name:"mouth",size:0.01},{name:"beard",size:0.02,external:true},
        {name:"eyes",size:0.03},{name:"eyesc",size:0.04},{name:"hair",size:0.05,external:true}
    ]

    export function createSkin()
    {
        var canv=document.createElement("canvas")
        canv.width=canv.height=128;
        var ctx=canv.getContext("2d");
        layers.forEach(l=>{
            if(l.external !=true)
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
            var h=800;
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
                        h= canvas.parentElement.clientHeight;
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

