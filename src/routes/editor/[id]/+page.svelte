<script lang="ts">
    import type { PageData } from './$types';
    let {data}:{data:PageData}= $props();
    import { Alert, Button, TabItem, Tabs } from "flowbite-svelte";
    import Main from "./skin/main.svelte";
    import MainSh from "./sheet/main.svelte";
    import type { SaveFormat } from './skin/skinTypes';
    import { getProfileSaver, localLoader, localSaver } from './skin/panel';
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    const active="inline-block text-lg font-medium text-center disabled:cursor-not-allowed p-4 rounded-lg active bg-primary-200 text-secondary-text" 
    const inactive="inline-block text-lg font-medium text-center disabled:cursor-not-allowed p-4 rounded-lg active hover:bg-primary-500 bg-primary-700 text-white"
    let currentAppearence=$state({data:{skin:[] as any[],stats:{points:{}},apparence:{}} as SaveFormat,isLoaded:false,listeners:[] as (()=>void)[]})
    let saver=$state({loader:localLoader,saver:localSaver});
    let canExport=$state(false)
    const pointsExports=(d:number)=>{canExport=data.factions==undefined || d<=0};
    if(data.sheet && data.sheet.id)
    {
     saver=getProfileSaver(data.sheet.id,data.sheet.data);
    }
    if(data.factions==undefined)
        canExport=true;
    onMount(()=>{
        if(browser && !currentAppearence.isLoaded)
        {
            currentAppearence.data=saver.loader();
            currentAppearence.isLoaded=true;
            currentAppearence.listeners.forEach(l=>l())
        }
    });
</script>
<Tabs tabStyle="pill"  class=" pb-4" contentClass=" p-3 h-fit rounded-lg bg-primary-300 w-full">
    {#if data.factions}
    <TabItem open  title="Caracteristiques" activeClass={active} inactiveClass={inactive}>
        <div  class="bg-primary-200 rounded-md">
            <MainSh {data} bind:currentAppearence={currentAppearence} dataSaver={saver} onPointsUpdate={pointsExports}/>
        </div>
    </TabItem>
    {/if}
    <TabItem title="Apparence" open={!data.factions} activeClass={active}  inactiveClass={inactive}>
        <div  class="bg-primary-200 rounded-md">
            <Main {data} bind:currentAppearence={currentAppearence} dataSaver={saver} {canExport}/>  
        </div>
    </TabItem>
</Tabs>
