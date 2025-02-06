<script lang="ts">
    import type { FormData } from "$lib/component/form.svelte";
    import Form from "$lib/component/form.svelte";
    import { Input, Label, Helper, Button, Checkbox, A, Avatar, Tooltip } from "flowbite-svelte";
    import type { User } from "$lib/session/session";
    import { browser } from "$app/environment";
    let { user }: { user?: User } = $props();
    let timer = $state(0);
    let mcname = $state("");
    let mcuuid=$state(user?.minecraftId);
    let int: NodeJS.Timeout | undefined;
    const nameChange = (data: FormData) => {
        fetch("?/username", {
            method: "POST",
            body: data.data.first_name,
        }).then((r) => {
            data.done();
            window.location.reload();
        });
    };
    const requestLinking = () => {
        fetch("?/link", { method: "POST", body: "" }).then(async (r) => {
            if (r.status == 200) {
                linkingCode = JSON.parse((await r.json()).data);
                timer = 60;
                clearInterval(int);
                int = setInterval(() => {
                    if (timer <= 0) {
                        lookupMcInfo()
                        linkingCode = "";
                        clearInterval(int);
                    }
                    if(timer%4==0)
                    {
                        lookupMcInfo()
                    }
                    timer--;
                }, 1000);
            }
        });
    };
    function lookupMcInfo()
    {
        fetch("/api/player/link").then(async (e)=>
        {
            if(e.status==200)
            {
                var dt=await e.json();
                if(dt.changed==true && user)
                {
                    mcuuid=dt.uuid;
                    timer=0;
                }
                mcname=dt.name
                
            }
        })
    }
    if(browser)
        lookupMcInfo();
    var linkingCode = $state("");
</script>

<div class="grid gap-6 mb-6 md:grid-cols-2">
    <div>
        <Label for="first_name" class="mb-2 text-primary-50">Pseudo</Label>
        <Form submit={nameChange} class="inline-flex space-x-4">
            <Input
                type="text"
                name="first_name"
                placeholder="Michel"
                required
                value={user?.username}
            />
        </Form>
    </div>
    <div>
        <h1 class="text-xl text-primary-50 mb-3">Liaison Minecraft</h1>
        {#if mcuuid && timer<=0}
            <span class="text-primary-100 bg-primary-700 rounded-md p-2">{mcname||mcuuid}</span>
            <Avatar class="bg-transparent h-14 w-14 m-2 ml-5" src="https://mc-heads.net/head/{mcuuid}/128"/>    
            <Button class="bg-secondary-text" onclick={requestLinking}>Re-lier un compte</Button>
            
        {:else}
            <p class="text-sm text-primary-300">Aucun compte liée</p>
            {#if timer<=0}
            <Button class="bg-secondary-text" onclick={requestLinking}>Lier mon compte</Button>
            {:else if linkingCode}
                <p class="text-secondary-text1">
                    Copier ce code et collez le dans votre jeu avec Ctrl+ V pour
                    lier ce skin à votre compte.
                </p>
                <Input class="w-22" type="text" readonly value={linkingCode} />
                <p class="text-secondary-text1">
                    Vous avez <b class="text-secondary-text">{timer}</b> secondes
                    avant de devoir recréer un code
                </p>
            {/if}
        {/if}
    </div>
</div>
