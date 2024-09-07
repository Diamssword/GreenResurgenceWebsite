<script lang="ts">
    import { page } from '$app/stores';
    import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
    $: activeUrl = $page.url.pathname;
  </script>
  
  <Navbar class="bg-primary-200">
    <NavBrand href="/">
      <img src="/images/logo.png" class="me-3 h-6 sm:h-12 rounded-lg" alt="Resurgence Logo" />
      <span class="self-center text-primary-text1 whitespace-nowrap text-2xl font-semibold">Resurgence</span>
    </NavBrand>
    <NavHamburger />
    <NavUl {activeUrl}  activeClass="text-primary-text" nonActiveClass="text-primary-text1">
      <NavLi class="text-lg" href="/">Acceuil</NavLi>
      <NavLi class="text-lg" href="/skin">Customiseur</NavLi>
      <NavLi class="text-lg" href="https://discord.com/invite/BgcDb6AZCQ" target="_blank"><img src="/images/svg/discord.svg" alt="Discord Logo" class="size-7 inline mr-1"> Discord</NavLi>
    </NavUl>
  </Navbar>