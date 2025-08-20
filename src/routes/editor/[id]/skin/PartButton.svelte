<script lang="ts">
    import { Button,Tooltip } from "flowbite-svelte";
    import { type SkinEditor } from "./panel";
    import type {  PickedTextureInfos, TextureInfos } from "./skinTypes";
    let {onclick,onclear,skinEditor,layer,texture,category,index}:{onclick:()=>void,onclear:()=>void,index?:number, skinEditor:SkinEditor,texture:TextureInfos,layer:string,category?:string}=$props();
    let picked=$state(false);
    function isPicked(picked?:PickedTextureInfos)
    {
        if(picked && texture)
        {
            if(((picked.subs && picked.subs.length>0 && picked.subs == texture.id) || ((picked.subs==undefined || picked.subs.length==0) && picked.id==texture.id)) && (picked.category ==undefined || picked.category==category))
                return true;
        }
        return false
    }
    picked=isPicked(skinEditor.onTextureChange(layer,index||0,(p)=>picked=isPicked(p)));
</script>
{#if texture.id=="clear"}
    <Button class="cursor-pointer ml-2 p-2 -translate-y-2" onclick={onclear}><img class="size-10" src="/skins/clear.svg" alt="Aucun"/></Button>    
    <Tooltip type="light">Aucun</Tooltip>
{:else}
    <Button class="cursor-pointer ml-2 p-0 {picked?"bg-secondary-text hover:bg-secondary-text2":""}" {onclick}><img class="size-14" src="/datas/skins_display/{skinEditor.getTextureIconPath(layer,texture.id,undefined,category)}" alt={texture.name||texture.id}/> </Button>  
    {#if texture.name}  
        <Tooltip type="light">{texture.name}</Tooltip>
    {/if}
{/if}
