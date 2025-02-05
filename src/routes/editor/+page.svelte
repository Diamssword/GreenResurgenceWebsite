<script lang="ts">
    import type { PageData } from './$types';
    export let data:PageData;
    import { Alert, Button, TabItem, Tabs } from "flowbite-svelte";
    import Main from "./skin/main.svelte";
   
</script>
<Tabs tabStyle="pill"  class="bg-primary-50 pb-4" contentClass=" p-3 h-fit rounded-lg bg-primary-600">
    <TabItem open title="Apparence" activeClasses="inline-block text-lg font-medium text-center disabled:cursor-not-allowed p-4 rounded-lg active bg-primary-700 text-primary-text" inactiveClasses="inline-block text-lg font-medium text-center disabled:cursor-not-allowed p-4 rounded-lg active bg-primary-600 text-white">
        <div  class="bg-primary-200 rounded-md">
        <Main {data}></Main>
        </div>
    </TabItem>
    <TabItem title="Caracteristiques" activeClasses="inline-block text-lg font-medium text-center disabled:cursor-not-allowed p-4 rounded-lg active bg-primary-700 text-primary-text"  inactiveClasses="inline-block text-lg font-medium text-center disabled:cursor-not-allowed p-4 rounded-lg active bg-primary-600 text-white">
        <div  class="bg-primary-200">
        
        </div>
    </TabItem>
</Tabs>

