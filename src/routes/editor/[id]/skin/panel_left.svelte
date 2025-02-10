<script lang="ts">
    import { Input, Tabs, Label, Toggle } from 'flowbite-svelte'; 
    import type { PageData } from '../$types';
    import { SkinEditor, SkinPart } from './panel';
    import SimpleCat from './simpleCat.svelte';
    import DuoCat from './duoCat.svelte';
    var {data,skinEditor,onExtra,setExtra=$bindable()} :{data:PageData["datas"],skinEditor:SkinEditor,onExtra:(slime:boolean,size:number)=>void,setExtra:(slim:boolean,taille:number)=>void} = $props();
    var taille:number=$state(40);1
    var slim=$state(false);   
    setExtra=(silm:boolean,taill:number)=>
    {
        slim=silm||false;
        taille=taill||67;
        onExtra(slim,taille)
    }
  </script>
  <div class="h-full overflow-auto">
    <Tabs contentClass="p-4 rounded-lg dark:bg-gray-800 mt-4 bg-primary-300">
        <SimpleCat cat={data[SkinPart.base]} layer={SkinPart.base} {skinEditor}>
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
                    <Toggle id="bras" checked={slim} on:change={(e)=>{slim=e.target.checked; onExtra(slim,taille)}} class="text-secondary-text cursor-pointer"></Toggle>
                    
                </div>    
           </div>
        </SimpleCat>
        <SimpleCat cat={data[SkinPart.underwear]} layer={SkinPart.underwear} {skinEditor}/>
        <SimpleCat cat={data[SkinPart.hair]} layer={SkinPart.hair} {skinEditor}/>
        <DuoCat cat={data["eyes"]} simpleLayer={"eyes"} layerLeft={SkinPart.left_eye} layerRight={SkinPart.right_eye} titleLeft="Oeil Gauche" titleRight="Oeil Droit" {skinEditor}/>
        <SimpleCat cat={data[SkinPart.cosmetic]} layer={SkinPart.cosmetic} {skinEditor}/>
        <SimpleCat cat={data[SkinPart.mouth]} layer={SkinPart.mouth} {skinEditor}/>
        <SimpleCat cat={data[SkinPart.beard]} layer={SkinPart.beard} {skinEditor}/>
    </Tabs>
  
</div>