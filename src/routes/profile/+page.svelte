<script lang="ts">
    import { SHARED } from '$lib/sharedDatas';
    import { TabItem, Tabs } from 'flowbite-svelte';
    import type { PageData } from './$types';
    import Personal from './personal.svelte';
    import Personnages from './personnages.svelte';
    let { data }: { data: PageData } = $props();
        $SHARED.title="Profile"
</script>
<h1 class="text-2xl text-center text-white mt-5">Bonjour <span class="text-secondary-text">{data.user?.username}</span> </h1>

<Tabs tabStyle="underline" contentClass="p-4 rounded-lg dark:bg-gray-800 m-2 bg-primary-500">
    <TabItem open   title="Profile" activeClasses="inline-block text-lg font-medium text-center disabled:cursor-not-allowed p-4 text-secondary-text border-b-2 border-secondary-text active"  inactiveClasses="inline-block text-lg font-medium text-center disabled:cursor-not-allowed p-4 border-b-2 border-transparent hover:text-gray-200 hover:border-gray-300 text-gray-400">
     <Personal user={data.user}/>
    </TabItem>
    <TabItem  title="Personnages" activeClasses="inline-block text-lg font-medium text-center disabled:cursor-not-allowed p-4 text-secondary-text border-b-2 border-secondary-text active" inactiveClasses="inline-block text-lg font-medium text-center disabled:cursor-not-allowed p-4 border-b-2 border-transparent hover:text-gray-200 hover:border-gray-300 text-gray-400">
       <Personnages sheets={data.sheets}/>
      </TabItem>
</Tabs>