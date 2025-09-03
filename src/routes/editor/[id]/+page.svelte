<script lang="ts">
    import type { PageData } from './$types';
    let {data}:{data:PageData}= $props();
    import { Alert, Button, TabItem, Tabs } from "flowbite-svelte";
    import Main from "./skin/main.svelte";
    import MainSh from "./sheet/main.svelte";
    import type { Factions, SaveFormat, Skills, SkinLayersFormat, SkinParts } from './skin/skinTypes';
    import { getProfileSaver, localLoader, localSaver, tryLoadResource } from './skin/panel';
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import Spinner from './spinner.svelte';
    import { currentAppearence } from './shared.svelte';
    const active="inline-block text-lg font-medium text-center disabled:cursor-not-allowed p-4 rounded-lg active bg-primary-200 text-secondary-text" 
    const inactive="inline-block text-lg font-medium text-center disabled:cursor-not-allowed p-4 rounded-lg active hover:bg-primary-500 bg-primary-700 text-white"
    let saver=$state({loader:localLoader,saver:localSaver});
    let canExport=$state(false)
    const pointsExports=(d:number)=>{canExport=skill==undefined || d<=0};
    if(data.sheet && data.sheet.id)
    {
     saver=getProfileSaver(data.sheet.id,data.sheet.data);
    }
    onMount(()=>{
        if(browser && !currentAppearence.isLoaded)
        {
            currentAppearence.data=saver.loader();
            currentAppearence.isLoaded=true;
            currentAppearence.listeners.forEach(l=>l())
        }
    });
     var factions:Factions|undefined;
    async function resolveFaction()
    {
         resloveSkin() //we preload the next page if we can
        if(!factions)
            factions= await tryLoadResource("/datas/factions.json") as Factions|undefined
        return factions;
    }
    var datas:{ datas:SkinParts|undefined,layers:SkinLayersFormat[]|undefined};
    async function resloveSkin() {
        if(!datas)
            datas= {datas:await tryLoadResource("/datas/skin_datas.json") as SkinParts|undefined,
        layers:await tryLoadResource("/datas/layers.json") as SkinLayersFormat[]|undefined};
        return datas;
    }
    var skill:Skills|undefined;
    async function resolveSkills()
    {
        if(!skill)
            skill=await tryLoadResource("/datas/skills.json") as Skills|undefined
        if(!skill)
           canExport=true;
        return skill;
    }
</script>
{#await resolveSkills()}
    <div class="flex items-center justify-center w-full h-full">
        <Spinner/>
    </div>
{:then skills} 
    <Tabs tabStyle="pill"  class=" pb-4" contentClass=" p-3 h-fit rounded-lg bg-primary-300 w-full">
        {#if skills !=undefined}
        <TabItem open  title="Caracteristiques" activeClass={active} inactiveClass={inactive}>
            <div  class="bg-primary-200 rounded-md">
                {#await resolveFaction()}
                    <Spinner/>
                {:then factions} 
                    {#if factions && skills}
                        <MainSh data={{factions,skills}} dataSaver={saver} onPointsUpdate={pointsExports}/>
                    {/if}
                {/await}
            </div>
        </TabItem>
        {/if}
        <TabItem title="Apparence" open={skills==undefined} activeClass={active}  inactiveClass={inactive}>
            <div  class="bg-primary-200 rounded-md">
                  {#await resloveSkin()}
                    <Spinner/>
                {:then  skin} 
                    {#if skin.datas && skin.layers}
                        <Main data={{datas:skin.datas,layers:skin.layers,hasStats: skills !=undefined}} dataSaver={saver} {canExport}/>  
                    {/if}
                {/await}
            </div>
        </TabItem>
    </Tabs>
{/await}
