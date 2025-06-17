<script lang="ts">
    import { Avatar, Button, Card, Input, Label, Select, Textarea } from "flowbite-svelte";
    import factionsJs from "$lib/datas/factions.json";
    import skillsJs from "$lib/datas/skills.json";
    import type { SaveFormat } from "../skin/skinTypes";
    import { onMount } from "svelte";
    import { browser } from "$app/environment";
    let {currentAppearence=$bindable(),dataSaver}:{currentAppearence:SaveFormat, dataSaver: {loader:()=>SaveFormat,saver:(data:SaveFormat)=>void} }=$props();
    const skills=skillsJs as {[id:string]:{name:string,desc:string,stages:number[]}};
    const factions=factionsJs as {[id:string]:{name:string,desc:string,bonus:{[key:string]:number},origines:{[key:string]:{name:string,desc:string,skills:{[key:string]:number}}},jobs:{[key:string]:{name:string,desc:string,skills:{[key:string]:number}}}}};
    var pickedFaction=$state(factions[Object.keys(factions)[0]]);
    var pickedFactionId=$state(Object.keys(factions)[0]);
    var pickedOrigine=$state("");
    var pickedJob=$state("");
    var remainingPoints=$state(50);
    var points=$state(fillPoints());
    var descs=$state({faction:{name:"",desc:""},origine:{name:"",desc:""},job:{name:"",desc:""}});
    var loaded=false;
    onMount(()=>{
        if(browser &&!loaded)
        {
                var stats=currentAppearence.stats;
                if(Object.keys(factions).includes(stats.faction))
                {
                    var fac=factions[stats.faction];
                    if(fac)
                    {
                        if(Object.keys(fac.origines).includes(stats.origine))
                            pickedOrigine=stats.origine;
                        if(Object.keys(fac.jobs).includes(stats.job))
                            pickedJob=stats.job;
                        pickedFaction=fac;
                        pickedFactionId=stats.faction;
                    }
                }
                loaded=true;
        }
    });
    function onFactionChange(fac:string)
    {
        var newF=factions[fac]
        pickedOrigine=Object.keys(newF.origines)[0];
        pickedJob=Object.keys(newF.jobs)[0];
        pickedFaction=newF;
        pickedFactionId=fac;
        descs.faction={name:newF.name,desc:newF.desc};
        points=fillPoints();
        if(loaded)
        {
            currentAppearence.stats.faction=fac;
            dataSaver.saver(currentAppearence);
        }
    }
    $effect(()=>{
        descs.origine={name:pickedFaction.origines[pickedOrigine].name,desc:pickedFaction.origines[pickedOrigine].desc};
        descs.job={name:pickedFaction.jobs[pickedJob].name,desc:pickedFaction.jobs[pickedJob].desc};
       saveData();
    })
    function saveData()
    {
        if(loaded)
        {
           currentAppearence.stats.origine=pickedOrigine;
           currentAppearence.stats.job=pickedJob;
           currentAppearence.stats.faction=pickedFactionId
           dataSaver.saver(currentAppearence);
        }
    }
    onFactionChange(Object.keys(factions)[0]);
    function fillPoints()
    {
        remainingPoints=50;
        var fnCap=(skill:string,num:number)=>{
            if(!res[skill])
            {
                console.error("Skill inconnu: "+skill)
                return 
            }
            res[skill].min+=num;
            res[skill].value+=num;
            remainingPoints-=num;
        }
        var res={} as {[key:string]:{value:number,min:number}};
        Object.keys(skills).forEach(v=>res[v]={min:0,value:0});
        if(pickedFaction)
        {
            Object.keys(pickedFaction.bonus).forEach(v=>{
                var b=pickedFaction.bonus[v];
                fnCap(v,b);
            });
        }
       if(pickedOrigine)
        {
            Object.keys(pickedFaction.origines[pickedOrigine].skills).forEach(v=>{
                if(pickedOrigine)
                    fnCap(v,pickedFaction.origines[pickedOrigine].skills[v]);
            });
        }
        if(pickedJob)
        {
            Object.keys(pickedFaction.jobs[pickedJob].skills).forEach(v=>{
                if(pickedJob)
                    fnCap(v,pickedFaction.jobs[pickedJob].skills[v]);
            });
        }
        return res;
    }
    function change(key:string,added:number)
    {
        if(added>0 && remainingPoints<=0)
        return;
        var old=points[key].value
        points[key].value=Math.max(Math.min(points[key].value+added,20),points[key].min)
        remainingPoints+=old-points[key].value
    }
</script>
<div class="w-full flex-1 p-2">
<div class="mb-5 grid gap-4 grid-cols-3">
    <div class="sm:col-span-3 flex gap-4">
        <div class="w-32">
            <Avatar class="w-32 h-32" src="/images/profile-picture-2.webp" cornerStyle="rounded"/>
        </div>
        <div class="w-60">
            <div class="">
                <Label for="lastname" class="">Nom</Label>
                <Input type="text" id="lastname" required />
            </div>
            <div class="">
                <Label for="name" class="">Prénom</Label>
                <Input type="text" id="name" required />
            </div>
        </div>
        <div>
            <div class="w-50">
                <Label for="faction" class="">Faction
                     <Select id=faction  placeholder="" onchange={v=>onFactionChange(v.target.value)}>
                        {#each Object.keys(factions) as key,i  }
                            <option selected={i==0} value={key}>{factions[key].name}</option>
                        {/each}
                    </Select>
                </Label>
                <div class="">
                <Label for="origine" class="">Origine
                    {#key pickedFaction}                   
                        <Select id=origine  placeholder="" onchange={v=>{pickedOrigine=v.target.value;points=fillPoints();}}>
                            {#each Object.keys(pickedFaction.origines) as key,i  }
                                <option selected={i==0} value={key}>{pickedFaction.origines[key].name}</option>
                            {/each}
                        </Select>
                    {/key}
                </Label>
            </div>
            </div>
        </div>
        <div class="w-50">
            <div class="">
                <Label for="metier" class="">Métier
                    {#key pickedFaction}                    
                        <Select id=metier  placeholder="" onchange={v=>{pickedJob=v.target.value;points=fillPoints();}}>
                            {#each Object.keys(pickedFaction.jobs) as key,i  }
                                <option selected={i==0} value={key}>{pickedFaction.jobs[key].name}</option>
                            {/each}
                        </Select>
                    {/key}
                </Label>
            </div>
        </div>
        <div class="w-3/5">
            <div class="grid gap-2 grid-cols-[auto_1fr]">
                <p class=" text-secondary-text text-nowrap">{descs.faction.name}:</p><p class="h-[3em] overflow-hidden text-ellipsis break-words line-clamp-2">{descs.faction.desc}</p>
                <p class=" text-secondary-text text-nowrap">{descs.origine.name}:</p><p class="h-[3em] overflow-hidden text-ellipsis break-words line-clamp-2">{descs.origine.desc}</p>
                <p class=" text-secondary-text text-nowrap">{descs.job.name}:</p><p class="h-[3em] overflow-hidden text-ellipsis break-words line-clamp-2">{descs.job.desc}</p>
            </div>
        </div>
    </div>
     <Card class="max-w-full p-3 bg-primary-300">
        <div>
            <div class="flex gap-1">
                <Label for="points" class="w-6/7 mr-4 text-secondary-text text-xl mb-2">Points Réstants</Label>
                <p class="flex items-center justify-center h-8 w-10 rounded-md bg-primary-50">{remainingPoints}</p>
            </div>
            <text class="w-full text-primary-50">Le nombre de points qu'il vous reste à assigner dans les différentes compétences disponibles</text>
        </div>
        </Card>
     {#each Object.keys(skills) as key}
        {@const skill = skills[key]}
        <div>
        <Card class="max-w-full p-3 bg-primary-300">
        <div>
            <div class="flex gap-1">
                <Label for="skill_{key}" class="w-4/5 mr-4 text-secondary-text text-xl mb-2">{skill.name}</Label>
                <Button class="h-8 w-8 p-0 " onclick={()=>change(key,-1)}>-</Button>
                <p class="flex items-center justify-center h-8 w-10 rounded-md bg-primary-50 {points[key].value>0?'text-secondary-text':''}">{points[key].value}</p>
                <Button class="h-8 w-8 p-0" onclick={()=>change(key,1)}>+</Button>
            </div>
            <text class="w-full text-primary-50">{skill.desc||"..."}</text>
        </div>
        </Card>
        </div>
     {/each}
</div>
</div>