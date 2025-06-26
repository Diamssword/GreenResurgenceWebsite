<script lang="ts">
    import {Alert, Avatar,Button,Card,Input, Label,Modal,Select, } from "flowbite-svelte";
    import factionsJs from "$lib/datas/factions.json";
    import skillsJs from "$lib/datas/skills.json";
    import type { SaveFormat } from "../skin/skinTypes";
    import { onMount } from "svelte";
    import { browser } from "$app/environment";
    import { SHARED } from "$lib/sharedDatas";
    let {
        currentAppearence = $bindable(),
        dataSaver,
        onloaded = $bindable(),
        onPointsUpdate
    }: {
        currentAppearence: SaveFormat;
        onloaded: () => void;
        dataSaver: {
            loader: () => SaveFormat;
            saver: (data: SaveFormat) => void;
        },
        onPointsUpdate:(left:number)=>void;
    } = $props();
    $SHARED.title="Caracteristiques"
    const skills = skillsJs as {[id: string]: { name: string; desc: string; stages: number[],disabled?:boolean };};
    const factions = factionsJs as {  [id: string]: { name: string; desc: string; bonus: { [key: string]: number };origines: {[key: string]: {name: string;desc: string; skills: { [key: string]: number }; }; };jobs: {[key: string]: {name: string;desc: string;skills: { [key: string]: number };};};};};
    let selectedFaction = $state(Object.keys(factions)[0]);
    let selectedOrigine = $state() as string;
    let selectedJob = $state() as string;
    let selectedNom = $state() as string;
    let selectedPrenom = $state() as string;
    let remainingPoints = $state(50);
    let originesItems = $state([] as { name: string; value: string }[]);
    let jobsItems = $state([] as { name: string; value: string }[]);
    let points = $state(fillPoints());
    let descs = $state({
        faction: { name: "", desc: "" },
        origine: { name: "", desc: "" },
        job: { name: "", desc: "" },
    });
    let pickedFac: (typeof factions)[0];
    let loreModal = $state(false);
    let loreContent= $state("");
    let loreContentTitle= $state("");
    function openLoreModal(title:string,text:string)
    {
        loreContentTitle=title;
        loreContent=text;
        loreModal=true;
    }
    onloaded = () => {
        if (browser) {
            let stats = currentAppearence.stats;
            if (Object.keys(factions).includes(stats.faction)) {
                let fac = factions[stats.faction];
                if (fac) {
                    if (Object.keys(fac.origines).includes(stats.origine))
                        selectedOrigine = stats.origine;
                    if (Object.keys(fac.jobs).includes(stats.job))
                        selectedJob = stats.job;
                    selectedFaction = stats.faction;
                    selectedNom=stats.lastname;
                    selectedPrenom=stats.firstname;
                    fillSelects(fac,true);
                    pickedFac = fac;
                    updateDescs(true);
                    remainingPoints=50;
                    Object.keys(stats.points).forEach(v=>{
                        
                        points[v].value=stats.points[v]
                        remainingPoints-=points[v].value;
                    });
                    onPointsUpdate(remainingPoints);
                    return;
                }
                 
            }
            pickedFac = factions[Object.keys(factions)[0]];
            fillSelects(pickedFac);
            updateDescs(true);
        }
    };
    onMount(onloaded);
    function onChangeFac(e?: any) {
        if (e?.target.value) selectedFaction = e.target.value;
        if (selectedFaction) {
            var f = factions[selectedFaction];
            fillSelects(f);
            pickedFac = f;
            updateDescs();
        }
    }
    function onChangeJobOrOri(e: any, isJob: boolean) {
        if (isJob) selectedJob = e.target.value;
        else selectedOrigine = e.target.value;
        updateDescs();
    }
    function onChangeText(value:string, field:"firstname"|"lastname") {
        
        currentAppearence.stats[field]=value;
        dataSaver.saver(currentAppearence);
    }
    function fillSelects(pickedFaction: (typeof factions)[0],init?:boolean) {
        originesItems = Object.keys(pickedFaction.origines).map((v) => {
            return { name: pickedFaction.origines[v].name, value: v };
        });
        if(!init)
            selectedOrigine = Object.keys(pickedFaction.origines)[0];
        jobsItems = Object.keys(pickedFaction.jobs).map((v) => {
            return { name: pickedFaction.jobs[v].name, value: v };
        });
        if(!init)
            selectedJob = Object.keys(pickedFaction.jobs)[0];
    }
    function updateDescs(init?:boolean) {
        descs.faction = { name: pickedFac.name, desc: pickedFac.desc };
        if (selectedOrigine)
            descs.origine = {
                name: pickedFac.origines[selectedOrigine].name,
                desc: pickedFac.origines[selectedOrigine].desc,
            };
        if (selectedJob)
            descs.job = {
                name: pickedFac.jobs[selectedJob].name,
                desc: pickedFac.jobs[selectedJob].desc,
            };
        points = fillPoints(pickedFac);
        if(!init)
        {
          currentAppearence.stats.points={};
          Object.keys(points).filter(v=>points[v].value>0).forEach(v=>{currentAppearence.stats.points[v]=points[v].value;})
        }
        currentAppearence.stats.origine = selectedOrigine;
        currentAppearence.stats.job = selectedJob;
        currentAppearence.stats.faction = selectedFaction;
        if(!init)
            dataSaver.saver(currentAppearence);
    }
    function fillPoints(pickedFaction?: (typeof factions)[0]) {
        remainingPoints = 50;
        var fnCap = (skill: string, num: number) => {
            if (!res[skill]) {
                console.error("Skill inconnu: " + skill);
                return;
            }
            res[skill].min += num;
            res[skill].value += num;
            remainingPoints -= num;
        };
        var res = {} as { [key: string]: { value: number; min: number } };
        Object.keys(skills).filter(v=>!skills[v].disabled).forEach((v) => (res[v] = { min: 0, value: 0 }));
        if (pickedFaction) {
            Object.keys(pickedFaction.bonus).forEach((v) => {
                var b = pickedFaction.bonus[v];
                fnCap(v, b);
            });

            if (selectedOrigine) {
                Object.keys(
                    pickedFaction.origines[selectedOrigine].skills,
                ).forEach((v) => {
                    if (selectedOrigine)
                        fnCap(
                            v,
                            pickedFaction.origines[selectedOrigine].skills[v],
                        );
                });
            }
            if (selectedJob) {
                Object.keys(pickedFaction.jobs[selectedJob].skills).forEach(
                    (v) => {
                        if (selectedJob)
                            fnCap(v, pickedFaction.jobs[selectedJob].skills[v]);
                    },
                );
            }
        }
        onPointsUpdate(remainingPoints);
        return res;
    }
    function change(key: string, added: number) {
        if (added > 0 && remainingPoints <= 0) return;
        var old = points[key].value;
        points[key].value = Math.max(Math.min(points[key].value + added, 20),points[key].min);
        currentAppearence.stats.points[key]=points[key].value;
        dataSaver.saver(currentAppearence)
        remainingPoints += old - points[key].value;
        onPointsUpdate(remainingPoints);
    }
</script>

<div class="w-full flex-1 p-2">
    <div class="mb-5 grid gap-4 grid-cols-3 items-stretch">
        <div class="sm:col-span-3 flex gap-4">
            <div class="w-32">
                <Avatar
                    class="w-32 h-32 bg-transparent"
                    src="/images/unknown_profil.png"
                    cornerStyle="rounded"
                />
            </div>
            <div class="w-60">
                
                <div class="">
                    <Label for="name" class="text-secondary-text">Prénom</Label>
                    <Input type="text" id="name" required bind:value={selectedPrenom} onchange={(e)=>onChangeText(e.target?.value,"firstname")}/>
                </div>
                <div class="">
                    <Label for="lastname" class="text-secondary-text">Nom</Label>
                    <Input type="text" id="lastname" required bind:value={selectedNom} onchange={(e)=>onChangeText(e.target?.value,"lastname")}/>
                </div>
            </div>
            <div>
                <div class="w-50">
                    <Label for="faction" class="text-secondary-text">Faction
                        <Select id="faction" placeholder="" value={selectedFaction} oninput={onChangeFac}>
                            {#each Object.keys(factions) as key, i}
                                <option selected={i == 0} value={key}>{factions[key].name}</option>
                            {/each}
                        </Select>
                    </Label>
                    <div class="">
                        <Label for="origine" class="text-secondary-text"
                            >Origine
                            <Select
                                id="origine"
                                items={originesItems}
                                placeholder=""
                                bind:value={selectedOrigine}
                                oninput={(e) => onChangeJobOrOri(e, false)}
                            />
                        </Label>
                    </div>
                </div>
            </div>
            <div class="w-50">
                <div class="">
                    <Label for="metier" class="text-secondary-text"
                        >Métier

                        <Select
                            id="metier"
                            items={jobsItems}
                            placeholder=""
                            bind:value={selectedJob}
                            oninput={(e) => onChangeJobOrOri(e, true)}
                        />
                    </Label>
                </div>
            </div>
            <div class="">
                <div class="grid gap-2 grid-cols-[auto_1fr]">
                    <p class=" text-secondary-text text-nowrap">
                        {descs.faction.name}:
                    </p>
                    <Button class="cursor-pointer bg-secondary-text flex-shrink-0 p-0 w-15 h-8" onclick={()=>openLoreModal(descs.job.name,descs.job.desc)}>Infos</Button>
                    <p class=" text-secondary-text text-nowrap">
                        {descs.origine.name}:
                    </p>
                    <Button class="cursor-pointer bg-secondary-text flex-shrink-0 p-0 w-15 h-8" onclick={()=>openLoreModal(descs.job.name,descs.job.desc)}>Infos</Button>
                    <p class=" text-secondary-text text-nowrap">
                        {descs.job.name}:
                    </p>
                        <Button class="cursor-pointer bg-secondary-text flex-shrink-0 p-0 w-15 h-8" onclick={()=>openLoreModal(descs.job.name,descs.job.desc)}>Infos</Button>
                </div>
            </div>
            <div class="ml-10 flex items-center ">
                <div class="max-w-full p-3 bg-primary-200">
                    <div>
                        <div class="flex gap-1">
                            <Label
                                for="points"
                                class="w-6/7 mr-4 text-secondary-text text-xl mb-2"
                                >Points Réstants</Label
                            >
                            <p class="flex items-center justify-center h-8 w-10 rounded-md bg-primary-50">
                                {remainingPoints}
                            </p>
                        </div>
                        <text class="w-full  text-gray-500">Le nombre de points qu'il vous reste à assigner dans les différentes compétences disponibles.</text>
                          {#if remainingPoints>0}
                            <p class="mt-2 text-secondary-text">Vous devez utiliser tout les points pour valider votre personnage </p>
                        {/if}
                    </div>
                </div>
               
            </div>
        </div>
       
        {#each Object.keys(skills) as key}
            {@const skill = skills[key]}
            {#if !skill.disabled}
            <div>
                <Card class="max-w-full p-3 bg-primary-300 stretch" >
                    <div>
                        <div class="flex gap-1">
                            <Label
                                for="skill_{key}"
                                class="w-4/5 mr-4 text-secondary-text text-xl mb-2"
                                >{skill.name}</Label
                            >
                            <Button class="h-8 w-8 p-0 cursor-pointer" onclick={() => change(key, -1)}>-</Button>
                            <p class="flex items-center justify-center h-8 w-10 rounded-md bg-primary-50 {points[key].value > 0? 'text-secondary-text': ''}">
                                {points[key].value}
                            </p>
                            <Button class="h-8 w-8 p-0 cursor-pointer" onclick={() => change(key, 1)}>+</Button>
                        </div>
                        <text class="w-full indent-6 text-gray-500 text-justify">{skill.desc || "..."}</text>
                    </div>
                </Card>
            </div>
            {/if}
        {/each}
    </div>
</div>
<Modal title={loreContentTitle} bind:open={loreModal} autoclose headerClass="text-secondary-text" class="bg-primary-100">
  <p class=" whitespace-pre-line text-justify text-base leading-relaxed text-gray-500 indent-6">{loreContent}</p>
</Modal>