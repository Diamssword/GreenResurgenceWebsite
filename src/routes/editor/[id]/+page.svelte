<script lang="ts">
    import type { PageData } from './$types';
    let {data}:{data:PageData}= $props();
    import { Alert, Button, TabItem, Tabs } from "flowbite-svelte";
    import Main from "./skin/main.svelte";
    import MainSh from "./sheet/main.svelte";
    const active="inline-block text-lg font-medium text-center disabled:cursor-not-allowed p-4 rounded-lg active bg-primary-200 text-secondary-text" 
    const inactive="inline-block text-lg font-medium text-center disabled:cursor-not-allowed p-4 rounded-lg active hover:bg-primary-500 bg-primary-700 text-white"
</script>
<Tabs tabStyle="pill"  class=" pb-4" contentClass=" p-3 h-fit rounded-lg bg-primary-300">
    <TabItem open title="Apparence" activeClasses={active} inactiveClasses={inactive}>
        <div  class="bg-primary-200 rounded-md">
        <Main {data}></Main>
        </div>
    </TabItem>
    <TabItem title="Caracteristiques" activeClasses={active}  inactiveClasses={inactive}>
        <div  class="bg-primary-200">
            <MainSh></MainSh>
        </div>
    </TabItem>
</Tabs>

