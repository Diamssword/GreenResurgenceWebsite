<script lang="ts">
    import { page } from '$app/state';
    import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Tooltip, Modal, Button } from 'flowbite-svelte';
    let user=$state(page.data.user)
    let activeUrl =$derived.by(()=>{
      if(page.url.pathname.startsWith("/editor"))
      return "/editor"
      return page.url.pathname});
    
    let connectForm=$state(false);
  </script>
  
  <Navbar class="bg-primary-800" id="mainnav">
    <NavBrand href="/">
      <img src="/images/logo.png" class="me-3 h-6 sm:h-12 rounded-lg" alt="Resurgence Logo" />
      <span class="self-center text-secondary-text1 whitespace-nowrap text-2xl font-semibold">Resurgence</span>
    </NavBrand>
    <NavHamburger />
    <NavUl {activeUrl}  activeClass="text-secondary-text" nonActiveClass="text-secondary-text1">
      <NavLi class="text-lg" href="/">Acceuil</NavLi>
      <NavLi class="text-lg" href="/editor">Customiseur</NavLi>
      <NavLi class="text-lg" href="https://discord.com/invite/BgcDb6AZCQ" target="_blank"><img src="/images/svg/discord.svg" alt="Discord Logo" class="size-7 inline mr-1"> Discord</NavLi>
      {#if !user}
      <NavLi class="text-lg cursor-pointer" onclick={()=>connectForm=true} >Connexion</NavLi>
      {:else}
      <NavLi class="text-lg" href="/profile">Profile</NavLi>
      
      <NavLi class="text-lg" href="/logout"><img src="/images/svg/logout.svg" alt="Déconnexion" class="size-7 inline mr-1"><Tooltip placement="right">Déconnexion</Tooltip></NavLi>
      {/if}
    </NavUl>
  </Navbar>
  <Modal bind:open={connectForm} size="xs" outsideclose autoclose class=" bg-primary-500">
    <div class="mb-4 text-sm font-light text-primary-100 dark:text-gray-400">
      <h3 class="mb-3 text-2xl font-bold text-primary-100 dark:text-white">Connexion</h3>
      <p>Vous connecter via un compte google permet de sauvgarder vos fiches de personnages ainsi que lier votre compte au jeu plus facilement.</p>
      <p>Un compte google est obligatoire pour cela.</p>
    </div>
    <div class="justify-center items-center pt-0 space-y-4 sm:flex sm:space-y-0 ">
        <Button outline class="w-full bg-secondary-text text-primary-100 text-xl" href="/login/google"><img alt="logo google" class="h-8 mr-2" src="/images/svg/google.svg"/>Connexion avec google</Button>
    </div>
  </Modal>