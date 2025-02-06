<script lang="ts">
    export type FormData={data:{[key:string]:any},done:()=>void,clear:()=>void}
    import { Button, Spinner } from "flowbite-svelte";
    let {children,submit,name="Modifier",disabled=false,class:clazz=""}:
    {submit:(form:FormData)=>void,name?:string,disabled?:boolean,class?:string,children?:any}=$props();
    var isLoading:boolean=$state(false);
    function onSub(e:Event){
        if(isLoading)
        return;
        const dt=Object.fromEntries(new FormData(e.target).entries())
        isLoading=true;
        const res=()=>{
            isLoading=false;
        }
        submit({data:dt,done:res,clear:()=>{
            e.target.reset();
        }});
    }
</script>
<form class={clazz} onsubmit={onSub}>
    {@render children?.()}
    <Button type="submit" {disabled} class="bg-secondary-text min-w-24">
    {#if isLoading}
    <Spinner size=5></Spinner>
    {:else}
        {name}
    {/if}
     </Button>
</form>