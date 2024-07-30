<script lang="ts">
    import Navbar from "$lib/component/navbar.svelte";
import "../app.css";
</script>
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
