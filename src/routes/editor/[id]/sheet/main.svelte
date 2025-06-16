<script lang="ts">
    import { Avatar, Button, Input, Label, Select, Textarea } from "flowbite-svelte";


</script>
<div class="grid gap-4 sm:grid-cols-2 sm:gap-6">
    <div>
         <Avatar src="/images/profile-picture-2.webp" cornerStyle="rounded" />
    </div>
			<div class="sm:col-span-2">
				<Label for="name" class="mb-2">Product Name</Label>
				<Input type="text" id="name" placeholder="Type product name" required />
			</div>
			<div class="w-full">
				<Label for="brand" class="mb-2">Brand</Label>
				<Input type="text" id="brand" placeholder="Product brand" required />
			</div>
			<div class="w-full">
				<Label for="price" class="mb-2">Price</Label>
				<Input type="text" id="price" placeholder="$29999" required />
			</div>
			<div class="w-full">
				<Label for="weight" class="mb-2">Item Weight (kg)</Label>
				<Input type="text" id="weight" placeholder="12" required />
			</div>
			<div class="sm:col-span-2">
				<Label for="description" class="mb-2">Description</Label>
				<Textarea id="description" placeholder="Your description here" rows={4} name="description" required />
			</div>
			<Button type="submit" class="w-32">Add product</Button>
		</div>
<p class="text-secondary-text text-center text-4xl">Coming soon</p>