<script lang="ts">
import { Carousel } from 'flowbite-svelte';
import images from '$lib/datas/main_carousel.json';
import { fade } from 'svelte/transition';
    const fadeAnimation = (x:any) => fade(x, {delay: 250, duration: 3000  });
    //https://sisik.eu/pano
</script>
<div class="max-w-full ">
    <Carousel class="rounded-none 2xl:h-[28rem] xl:h-96" imgClass="" transition={fadeAnimation} {images} duration=10000 />
  </div>

<style>
    .carrousel{
        height: 600px;
    }
</style>