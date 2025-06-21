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
    let currentAppearence=$state({skin:{},stats:{points:{}},apparence:{}} as SaveFormat);
    let saver=$state({loader:localLoader,saver:localSaver});
    let loadedClb=$state(()=>{});
    let canExport=$state(false)
    const pointsExports=(d:number)=>canExport=d<=0;
    if(data.sheet && data.sheet.id)
    {
     saver=getProfileSaver(data.sheet.id,data.sheet.data);
    }
    
    let loaded=false;
    onMount(()=>{
        if(browser && !loaded)
        {
            loaded=true;
            currentAppearence=saver.loader();
            loadedClb();
        }
    });
</script>
<Tabs tabStyle="pill"  class=" pb-4" contentClass=" p-3 h-fit rounded-lg bg-primary-300">
    <TabItem open  title="Caracteristiques" activeClass={active} inactiveClass={inactive}>
        <div  class="bg-primary-200 rounded-md">
        <MainSh bind:currentAppearence={currentAppearence} dataSaver={saver} bind:onloaded={loadedClb} onPointsUpdate={pointsExports}/>
        </div>
    </TabItem>
    <TabItem title="Apparence" activeClass={active}  inactiveClass={inactive}>
        <div  class="bg-primary-200 rounded-md">
            <Main {data} bind:currentAppearence={currentAppearence} dataSaver={saver} bind:onloaded={loadedClb} {canExport}/>  
        </div>
    </TabItem>
</Tabs>

