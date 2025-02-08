<script lang="ts">
    import { Button, Input, TabItem, Tooltip } from "flowbite-svelte";
    import { SkinPart, type SkinEditor } from "./panel";
    import type { SkinPartsFormat } from "./skinTypes";

    let {children,skinEditor,cat,layer}:{children?:any,skinEditor:SkinEditor,cat:SkinPartsFormat,layer:string}=$props();
</script>
<TabItem title={cat.title} open={layer==SkinPart.base}>
<p class=" text-secondary-text text-2xl">{cat.title}</p>
{#each Object.keys(cat.cats||{"":""}) as sub}
{#if cat.cats}
    <h2>{cat.cats[sub]}</h2>
{/if}
<div class="my-3">
    {#each cat.images.filter(c=>c.cat==sub || sub=="") as skin}
    {#if skin.id=="clear"}
        <Button class="ml-2 p-2 -translate-y-2" on:click={()=>skinEditor.clearPart(layer)}><img class="size-10" src="/skins/display/clear.svg" alt="Aucun"/></Button>    
        <Tooltip type="light">Aucun</Tooltip>
    {:else}
        <Button class="ml-2 p-0" on:click={()=>skinEditor.pickTexture(layer,skin.id)}><img class="size-14" src="/skins/display/{skinEditor.getTexturePath(layer,skin.id)}" alt={skin.name||skin.id}/> </Button>  
        {#if skin.name}  
             <Tooltip type="light">{skin.name}</Tooltip>
        {/if}
    {/if}
    {/each}     
</div>
{/each}
{#if cat.colors}
{#if cat.colors=="free"}
{@const col=skinEditor.getPickedColor(layer)}
<p class="mb-2 ml=5 mt-5 text-secondary-text text-xl">Couleur:</p>
    <Input type="color" class="w-10 cursor-pointer" style="background-color:{col};" on:input={(ev)=>{ev.target.style.backgroundColor=ev.target.value; skinEditor.pickColor(layer,ev.target.value)}} value={col}/>
{:else}
<p class="mb-2 mt-5 text-secondary-text w-full text-xl">Couleurs:</p>
    {#each cat.colors as color}
    <Button class="ml-2" outline style=" background-color:{color}"  on:click={()=>skinEditor.pickColor(layer,color)} />
    {/each}
{/if}
{/if}
{@render children?.()}
</TabItem>