<script lang="ts">
import { Button, Carousel } from 'flowbite-svelte';
import images from '$lib/datas/main_carousel.json';
import { fade } from 'svelte/transition';
import { SHARED } from '$lib/sharedDatas';
$SHARED.title=undefined;
    const fadeAnimation = (x:any) => fade(x, {delay: 250, duration: 3000  });
    //https://sisik.eu/pano
</script>
<div class="max-w-full ">
    <Carousel class="rounded-none 2xl:h-[28rem] xl:h-96" imgClass="" transition={fadeAnimation} {images} duration=10000 />
    <div class="flex justify-center mt-14 -translate-y-32">
        <div class="textbg inline-flex rounded-3xl h-52">
            <img src="/images/logo.png" alt="Logo Resurgence" class="size-48 rounded-l-3xl"/>
            <p class="megatext text-gray-50 -translate-x-4 -translate-y-2" >ESURGENCE</p>
        </div>
  </div>
  <div class="mx-24  -mt-24 text-primary-text1 text-2xl">
        <p >
        Résurgence est un serveur Minecraft Roleplay moddé sur le thème de la Post-Apocalypse verte.
        </p>
        <p>
            Vous tâchez de survivre dans les ruines d’un monde où la nature n’a pas juste repris ses droits: elle essaye activement de vous tuer!
        </p>
        <p>
            Rejoignez un clan, fortifiez votre campement, partez en expédition, améliorez vos compétences et forgez des alliances pour dominer une nature bien décidée à vous anéantir.
        </p>
        <div class="flex justify-center mb-5 mt-5">
        <Button href="https://discord.com/invite/BgcDb6AZCQ" class="text-4xl"> Rejoignez nous <img class="size-20 ml-5" src="/images/svg/discord.svg"/></Button>
        </div>
        <div class="flex justify-center mb-20 text-3xl text-primary-text">
            <p>🛠️Le serveur est toujours en projet et nous cherchons des gens motivés pour nous aider🛠️</p>
        </div>
        
  </div>
</div>

<style>
    .carrousel{
        height: 600px;
    }
    .megatext{
        font-size: 10rem;
    }
    .textbg{
        background-color: #b28038;
    }
</style>