<script lang="ts">
    import {Avatar,Input, Label, } from "flowbite-svelte";
    import type { SaveFormat } from "../skin/skinTypes";
    import { onMount } from "svelte";
    import { currentAppearence } from "../shared.svelte";
    let {dataSaver}:
        {dataSaver: { loader: () => SaveFormat; saver: (data: SaveFormat) => void;} } = $props();
    
    let selectedNom = $state() as string;
    let selectedPrenom = $state() as string;

    function onloaded(){
        if(currentAppearence.isLoaded)
        {
            let stats = currentAppearence.data.stats;
            selectedNom=stats.lastname;
            selectedPrenom=stats.firstname;
        }
    };
    currentAppearence.listeners.push(onloaded)
    onMount(onloaded)

    function onChangeText(value:string, field:"firstname"|"lastname") {
        
        currentAppearence.data.stats[field]=value;
        dataSaver.saver(currentAppearence.data);
    }
</script>
                
                <div class="">
                    <Label for="name" class="text-secondary-text">Prénom</Label>
                    <Input type="text" id="name" required bind:value={selectedPrenom} onchange={(e)=>onChangeText(e.target?.value,"firstname")}/>
                </div>
                <div class="">
                    <Label for="lastname" class="text-secondary-text">Nom</Label>
                    <Input type="text" id="lastname" required bind:value={selectedNom} onchange={(e)=>onChangeText(e.target?.value,"lastname")}/>
                </div>

