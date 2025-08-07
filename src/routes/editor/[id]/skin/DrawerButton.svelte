<script lang="ts">
    import { Button,Dropdown,Tooltip } from "flowbite-svelte";
    import { type SkinEditor } from "./panel";
    import type { TextureInfos } from "./skinTypes";
    let {onclick,skinEditor,layer,texture,category}:{onclick:(sub:TextureInfos)=>void, skinEditor:SkinEditor,texture:TextureInfos,layer:string,category?:string}=$props();
</script>
{#if texture.subs}
    <Button class="ml-2 p-0 bg-secondary-900 relative cursor-pointer" >
        <img class="size-14" src="/skins/display/{skinEditor.getTextureIconPath(layer,texture.subs[0].id,texture.id,category)}" alt={texture.name||texture.id}/>
        <img class="absolute w-8 h-8 -bottom-2" src="/images/svg/chevron.svg" alt="dropdown" >
    </Button>
    <Dropdown  class="ml-2 p-0">
        <div class="p-1">
            {#each texture.subs as sub }
                <Button class="ml-2 p-0 cursor-pointer" onclick={()=>onclick(sub)}><img class="size-14" src="/skins/display/{skinEditor.getTextureIconPath(layer,sub.id,texture.id,category)}" alt={sub.name||sub.id}/></Button>
            {/each}
        </div>
    </Dropdown>
{/if}
