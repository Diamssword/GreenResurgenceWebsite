<script>import Navbar from "$lib/component/navbar.svelte";
import { SHARED } from "$lib/sharedDatas";
    import { Toast } from "flowbite-svelte";
import "../app.css";</script>
<svelte:head>
    <meta property="og:title" content="Resurgence" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://resurgence.info" />
    <meta property="og:image" content="https://resurgence.info/images/logo.png" />
    <meta property="og:description" content="Serveur Minecraft post-apocalyptique" />
    <meta name="theme-color" content="#5c9829" />
    <title>{$SHARED.title?$SHARED.title+" |":""}Resurgence</title>
</svelte:head>
<div class="flex w-full h-screen flex-col">
<Navbar></Navbar>
<main class="overflow-y-auto flex-1 pt-4 bg-primary-600">
    
<slot></slot>
{#if $SHARED.error}
<Toast class="fixed bottom-4 right-4 rounded-lg bg-red-300 text-primary-50" onclose={()=>{$SHARED.error=undefined}}>
    {$SHARED.error}
  </Toast>
{/if}
</main>
</div>
<style>
    div{
        max-height: 100vh;
    }
</style>
