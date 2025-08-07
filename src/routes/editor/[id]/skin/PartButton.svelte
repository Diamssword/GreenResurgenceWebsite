<script lang="ts">
    import { Button,Tooltip } from "flowbite-svelte";
    import { type SkinEditor } from "./panel";
    import type { TextureInfos } from "./skinTypes";
    let {onclick,onclear,skinEditor,layer,texture,category}:{onclick:()=>void,onclear:()=>void, skinEditor:SkinEditor,texture:TextureInfos,layer:string,category?:string}=$props();
</script>
{#if texture.id=="clear"}
    <Button class="cursor-pointer ml-2 p-2 -translate-y-2" onclick={onclear}><img class="size-10" src="/skins/display/clear.svg" alt="Aucun"/></Button>    
    <Tooltip type="light">Aucun</Tooltip>
{:else}
    <Button class="cursor-pointer ml-2 p-0" {onclick}><img class="size-14" src="/skins/display/{skinEditor.getTextureIconPath(layer,texture.id,undefined,category)}" alt={texture.name||texture.id}/> </Button>  
    {#if texture.name}  
        <Tooltip type="light">{texture.name}</Tooltip>
    {/if}
{/if}
