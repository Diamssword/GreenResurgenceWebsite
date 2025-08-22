<script lang="ts">
    import {Avatar,Input, Label, } from "flowbite-svelte";
    import type { SaveFormat } from "../skin/skinTypes";
    import { onMount } from "svelte";
    import { browser } from "$app/environment";
    import { SHARED } from "$lib/sharedDatas";
    import type { PageData } from "../$types";
    let {
        currentAppearence = $bindable(),
        dataSaver,
        onloaded = $bindable(),
        onPointsUpdate,
        data
    }: {
        data:PageData,
        currentAppearence: SaveFormat;
        onloaded: () => void;
        dataSaver: {
            loader: () => SaveFormat;
            saver: (data: SaveFormat) => void;
        },
        onPointsUpdate:(left:number)=>void;
    } = $props();
    $SHARED.title="Caracteristiques"
    let selectedNom = $state() as string;
    let selectedPrenom = $state() as string;

    onloaded = () => {
        if (browser) {
            let stats = currentAppearence.stats;
            selectedNom=stats.lastname;
            selectedPrenom=stats.firstname;
            
            }
    };
    onMount(onloaded);

    function onChangeText(value:string, field:"firstname"|"lastname") {
        
        currentAppearence.stats[field]=value;
        dataSaver.saver(currentAppearence);
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
        </div>
    </div>
</div>
