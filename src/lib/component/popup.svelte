<script lang="ts">
    import { Button, Modal } from 'flowbite-svelte';
    let {onClose, children,yes="Oui",no="Non",open=false}:{onClose:(confirmed:boolean)=>void,yes?:string,no?:string,open:boolean,children?:any} = $props();
    
  </script>
  
  <Modal bind:open={open} size="xs" autoclose class=" bg-primary-700">
    <div class="text-center">
      <h3 class="mb-5 text-lg font-normal text-secondary-text dark:text-gray-400">{@render children?.()}</h3>
      <Button color="red" class="me-2" onclick={()=>onClose(true)}>{yes}</Button>
      <Button color="alternative"  onclick={()=>onClose(false)}>{no}</Button>
    </div>
  </Modal>