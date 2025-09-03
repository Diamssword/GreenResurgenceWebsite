<script lang="ts">
    import { Input, Tabs, Label, Toggle } from 'flowbite-svelte'; 
    import type { PageData } from '../$types';
    import { SkinEditor,BASE } from './panel';
    import SimpleCat from './SimpleCat.svelte';
    import MutliCat from './MutliCat.svelte';
    import SplittedMutliCat from './SplittedMutliCat.svelte';
    import WithoutStats from '../sheet/without_stats.svelte';
    import type { SaveFormat, SkinLayersFormat, SkinParts } from './skinTypes';
    import { onMount } from 'svelte';
    import { currentAppearence } from '../shared.svelte';
    var {data,skinEditor,onExtra,dataSaver} :{data:{hasStats:boolean, datas:SkinParts,layers:SkinLayersFormat[]},skinEditor:SkinEditor,onExtra:(slime:boolean,size:number)=>void,dataSaver: {loader: () => SaveFormat; saver: (data: SaveFormat) => void;}} = $props();
    var taille:number=$state(40);
    var slim=$state(false);   
    function onLoaded()
    {
        if(currentAppearence.isLoaded)
        {
            slim=currentAppearence.data.apparence?.slim||false;
            taille=currentAppearence.data.apparence?.size||67;
            onExtra(slim,taille)
        }
    }
    currentAppearence.listeners.push(onLoaded)
    onMount(onLoaded);
  </script>
  <div class="h-full overflow-auto">
    <Tabs contentClass="p-4 rounded-lg dark:bg-gray-800 mt-4 bg-primary-300">
        <SimpleCat cat={data.datas[BASE]} layer={BASE} {skinEditor}>
            <div class="grid gap-6 mb-6 md:grid-cols-2">
                <div>
                    <Label for="taille"  class="mb-2 ml=5 mt-5 text-secondary-text text-xl" >Taille:</Label>
                    <div class=" flex">
                        <p class=" content-center mr-1">1m</p>
                        <Input class="w-22" type="number" min=40 max=99 id="taille" placeholder={Math.floor(40+(Math.random()*45))} required oninput={()=>onExtra(slim,taille)} bind:value={taille}/>
                    </div>
            
                </div>
                <div>
                    <Label for="bras"  class="mb-2 ml=5 mt-5 text-secondary-text text-xl">Bras fins:</Label>
                    <Toggle id="bras" checked={slim} onchange={(e)=>{slim=e.target.checked; onExtra(slim,taille)}} class="text-secondary-text cursor-pointer"></Toggle>
                </div>    
                {#if !data.hasStats}
                    <WithoutStats dataSaver={dataSaver}></WithoutStats>
                {/if}
           </div>
        </SimpleCat>
        {#each data.layers as layer  }
        {@const layerInf=data.datas[layer.name]||{title:"Unknown"}}
            {#if layer.splited}
                <SplittedMutliCat cat={layerInf} layer={layer.name} {skinEditor}/>
            {:else if layer.multi}
                <MutliCat cat={layerInf} layer={layer.name} {skinEditor}/>
            {:else if layer.name!=BASE}
                <SimpleCat cat={layerInf} layer={layer.name} {skinEditor}/>
            {/if}
        {/each}
    </Tabs>
  
</div>