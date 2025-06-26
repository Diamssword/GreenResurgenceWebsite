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
    
</div>
