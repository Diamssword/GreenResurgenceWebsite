<script lang="ts">
    import { Button, Dropdown, Input, TabItem, Tooltip } from "flowbite-svelte";
    import { type SkinEditor } from "./panel";
    import type { SkinPartsFormat } from "./skinTypes";
    import PartButton from "./PartButton.svelte";
    import DrawerButton from "./DrawerButton.svelte";
    let {children,skinEditor,cat,layer}:{children?:any,skinEditor:SkinEditor,cat:SkinPartsFormat,layer:string}=$props();
</script>
<TabItem title={cat.title} open={layer=="base"}>
<p class=" text-secondary-text text-2xl">{cat.title}</p>
{#each Object.keys(cat.cats||{"":{name:"",images:cat.images}}) as subk}
{@const sub=cat.cats?cat.cats[subk]:{name:"",images:cat.images}}
{#if cat.cats}
    <h2>{sub.name}</h2>
{/if}
<div class="my-3">
    {#if sub.images}
        {#each sub.images as skin}
            {#if skin.subs }
                <DrawerButton category={subk} {layer} {skinEditor} texture={skin} onclick={(sub)=>skinEditor.pickTexture(layer,{subs:skin.id,category:subk,id:sub.id})} />
            {:else}
                <PartButton {layer} category={subk} {skinEditor} texture={skin} onclear={()=>skinEditor.clearPart(layer)} onclick={()=>skinEditor.pickTexture(layer,{id:skin.id,subs:subk})}/>
            {/if}
        {/each}     
    {/if}
</div>
{/each}
{@render children?.()}
</TabItem>