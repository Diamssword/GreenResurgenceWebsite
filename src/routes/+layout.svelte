<script lang="ts">
    import { navigating } from "$app/stores";
    import Navbar from "$lib/component/navbar.svelte";
    import { SHARED } from "$lib/sharedDatas";
import "../app.css";
</script>
<svelte:head>
    <title>{$SHARED.title?$SHARED.title+" |":""}Resurgence</title>
</svelte:head>
<div class="flex w-full h-screen flex-col">
<Navbar/>
<main class="overflow-y-auto flex-1 pt-4 bg-primary-50">
    
<slot></slot>
</main>
</div>
<style>
    div{
        max-height: 100vh;
    }
</style>
