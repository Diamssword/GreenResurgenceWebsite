<script lang="ts">
    import { AccordionItem, Accordion, Button, Input, Label, Tooltip } from 'flowbite-svelte'; 
    import type { PageData } from './$types';
    import type {SkinViewer} from "$lib/skinviewer3d/skinview3d";
    import type { ColorRepresentation } from 'three';
    import { browser } from '$app/environment';
    import type { eyeType } from '$lib/skinviewer3d/textureHelper';
    export let data:PageData["datas"];
    export let viewer:SkinViewer;
    var pickedEyeType:eyeType|undefined;
    var isBrowAnimated:boolean=true;
    var pickedColors:{[key:string]:ColorRepresentation}={"eyesc":"#126A87"};
    var pickedTexture:{[key:string]:string}={};
    export function getSkinDatas()
    {
        var res:{[key:string]:{texture?:string,color?:ColorRepresentation,type?:eyeType}}={};
        for(const k in pickedTexture)
        {
                res[k]={texture:pickedTexture[k]}
                if(k=="eyes")
                    res[k].type=pickedEyeType;
        }
        for(const k in pickedColors)
        {
            if(!res[k])
                res[k]={color:pickedColors[k]}
            else
                res[k].color=pickedColors[k];
        }
        return res;
    }
    function saveTemp()
    {
        if(browser)
        {
            window.localStorage.setItem("skin_builder_datas",JSON.stringify(toJson()))
        }
    }
    function loadSkin(cat:string,id:string)
    {
        var tc=cat;
        if(cat=="eyesc")
            tc="eyes"
        if(cat=="eyes")
        {
            pickedEyeType=data["eyes"].images.find(d=>d.id==id)?.anim
            loadSkin("eyesc",id+"b");
            if(pickedTexture["brows"])
                setTimeout(() => {
                    loadSkin("brows",pickedTexture["brows"]);
                }, 100);
        }
        else if(cat=="brows")
        {
            isBrowAnimated=data["brows"].images.find(d=>d.id==id)?.anim !="false"
        } 
        pickedTexture[cat]=id;
        if(id=="clear")
            viewer.loadSkin(cat,"/skins/clear.png")
        else
            viewer.loadSkin(cat,"/skins/"+tc+"/"+pickedTexture[cat]+".png",{color:getPickedColor(cat),eyeType:pickedEyeType,animatedBrows:isBrowAnimated})
            if(cat=="base")
            {
                if(pickedTexture["eyes"])
                setTimeout(() => {
                    loadSkin("eyes",pickedTexture["eyes"]);
                }, 100);
            
            }
        saveTemp();
    }
    function pickColor(cat:string,color:ColorRepresentation)
    {
        if(cat=="eyes")
            return pickColor("eyesc",color);
        pickedColors[cat]=color;
        loadSkin(cat,getPickedTexture(cat))
    }
    function getPickedTexture(cat:string)
    {
        if(!pickedTexture[cat] && data[cat].images){
            pickedTexture[cat]= data[cat].images[0].id;
        }
        return pickedTexture[cat];
            
    }
    function getPickedColor(cat:string)
    {
        
        if(cat=="eyesc")
        {
            if(!pickedColors[cat] && data["eyes"].colors){
                pickedColors[cat]= data["eyes"].colors[0]
            }
            return pickedColors[cat];
        }
        if(!pickedColors[cat] && data[cat].colors){
            pickedColors[cat]= data[cat].colors[0]
        }
        return pickedColors[cat];
            
    }
    var loaded=false;
    $:if(viewer && !loaded)
    {
        loaded=true;
            if(browser)
                loadDefault(JSON.parse(window.localStorage.getItem("skin_builder_datas")||"{}"));
        
    }
    export function loadDefault(saved:any)
    {
        if(data && viewer)
        {
           
            for(var k in data)
            {
                if(saved[k])
                {
                    if(saved[k].color)
                    {
                        if(data[k]?.colors!=undefined)
                            pickedColors[k]=saved[k].color;
                    }
                    pickedTexture[k]=saved[k].texture;
                }
                else
                    pickedTexture[k]=data[k].images[0].id;
            }
            for(var k in pickedTexture)
            {
                loadSkin(k,pickedTexture[k]);
            }
            
        }
    }
    export function toJson()
    {
        var res:{[key:string]:{texture:string,color?:string}}={};
        for( let k in pickedTexture)
        {
            res[k]={texture:pickedTexture[k]};
            if(pickedColors[k])
                res[k].color=pickedColors[k].toString()
        }
        return res;
        
    }
    export function fromJson(json:any)
    {
        for(let k in json)
        {
            if(json[k].color)
            {
                if(data[k]?.colors!=undefined)
                    pickedColors[k]=json[k].color;
            }
            loadSkin(k,json[k].texture)
        }
    }
    function getAllInSub(sub:string,images:typeof data[""]["images"])
    {
        if(sub=="")
            return images;
        var res=[];
        for(var d in images)
        {
            if(images[d].cat==sub)
                res.push(images[d]);
        }
        return res;
    }
  </script>
  <div class="h-full overflow-auto">
  <Accordion multiple>
    {#if data}
    {#each Object.keys(data) as k }
    {@const cat = data[k]}
    <AccordionItem class="p-2 group-last:rounded-b-xl" open>
       
        <span slot="header" class="text-xl flex gap-1 text-primary-text">
         {cat.title}
        </span>
        {#each Object.keys(cat.cats||{"":""}) as sub}
        {#if cat.cats}
            <h2>{cat.cats[sub]}</h2>
        {/if}
        <div class="my-3">
            {#each getAllInSub(sub,cat.images) as skin}
            {#if skin.id=="clear"}
                <Button class="ml-2 p-2 -translate-y-2" on:click={()=>loadSkin(k,"clear")}><img class="size-10" src="/skins/display/clear.svg" alt="Aucun"/></Button>    
                <Tooltip type="light">Aucun</Tooltip>
            {:else}
                <Button class="ml-2 p-0" on:click={()=>loadSkin(k,skin.id)}><img class="size-14" src="/skins/display/{k}/{skin.id}.png" alt={skin.name||skin.id}/> </Button>  
                {#if skin.name}  
                <Tooltip type="light">{skin.name}</Tooltip>
                {/if}
            {/if}
            {/each}     
        </div>
        {/each}
        {#if cat.colors}
        {#if cat.colors=="free"}
        {@const col=getPickedColor(k=="eyes"?"eyesc":k)}
        <p class="mb-2 ml=5 mt-5 text-primary-text text-xl">Couleur:</p>
            <Input type="color" class="w-10 cursor-pointer" style="background-color:{col};" on:input={(ev)=>{ev.target.style.backgroundColor=ev.target.value; pickColor(k,ev.target.value)}} value={col}/>
        {:else}
        <p class="mb-2 mt-5 text-primary-text w-full text-xl">Couleurs:</p>
            {#each cat.colors as color}
            <Button class="ml-2" style=" background-color:{color}"  on:click={()=>pickColor(k,color)} />
            {/each}
        {/if}
        
        {/if}
      </AccordionItem>
    {/each}
   
    {/if}
    </Accordion>
</div>