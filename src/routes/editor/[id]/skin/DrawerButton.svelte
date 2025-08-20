<script lang="ts">
    import { Button,Dropdown,Tooltip } from "flowbite-svelte";
    import { type SkinEditor } from "./panel";
    import type { PickedTextureInfos, TextureInfos } from "./skinTypes";
    let {onclick,skinEditor,layer,texture,category,index}:{onclick:(sub:TextureInfos)=>void,index?:number, skinEditor:SkinEditor,texture:TextureInfos,layer:string,category?:string}=$props();
    let picked:string|undefined=$state(undefined);
    function getSubPicked(picked?:PickedTextureInfos)
    {
        if(picked && texture)
        {
            if(picked.subs==texture.id && (picked.category ==undefined || picked.category==category))
                return picked.id
        }
        return undefined
    }
    picked=getSubPicked(skinEditor.onTextureChange(layer,index||0,(p)=>picked=getSubPicked(p)));
</script>
{#if texture.subs}
    <Button class="ml-2 p-0 {picked?"bg-secondary-text hover:bg-secondary-text2":""} relative cursor-pointer" >
        <img class="size-14" src="/datas/skins_display/{skinEditor.getTextureIconPath(layer,texture.subs[0].id,texture.id,category)}" alt={texture.name||texture.id}/>
        <img class="absolute w-8 h-8 -bottom-2" src="/images/svg/chevron.svg" alt="dropdown" >
    </Button>
    <Dropdown  class="ml-2 p-0">
        <div class="p-1">
            {#each texture.subs as sub }
                <Button class="ml-2 p-0 cursor-pointer {picked==sub.id?"bg-secondary-text hover:bg-secondary-text2":""}" onclick={()=>{onclick(sub); picked=sub.id}}><img class="size-14" src="/datas/skins_display/{skinEditor.getTextureIconPath(layer,sub.id,texture.id,category)}" alt={sub.name||sub.id}/></Button>
            {/each}
        </div>
    </Dropdown>
{/if}
