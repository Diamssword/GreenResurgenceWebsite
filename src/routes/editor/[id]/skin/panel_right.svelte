<script lang="ts">
    import { Button, Dropdown, DropdownItem, Input,Popover,Tooltip } from 'flowbite-svelte'; 
    import { exportCharacter, SkinEditor } from './panel';
    import type { SaveFormat } from './skinTypes';
    type Props={
      changePhysicFn:(slim:boolean,taille:number)=>void
    currentSave:SaveFormat
    editor:SkinEditor
    sheetName?:string
    }
    var {changePhysicFn,editor,currentSave,sheetName}:Props=$props();
    var code:string|undefined=$state();
    var timer=$state(0);
    var int: NodeJS.Timeout | undefined;
    function exporte()
    {
      exportCharacter(editor,currentSave).then(e=>{
          code=e
          timer=60;
          clearInterval(int);
          int=setInterval(()=>{
            if(timer<=0)
            {
              code=undefined;
              clearInterval(int);
            }
            timer--;
          },1000)
         
      })
    }
    function exportImage()
    {
      var dt=editor.toPNG(true);
      var element = document.createElement('a');
      element.setAttribute('href', dt);
      element.setAttribute('download', (currentSave.stats.firstname||"skin")+".png");
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
    function saveDatas()
    {
      var file = new Blob([JSON.stringify(currentSave)], {type: "text/json"});
      var element = document.createElement('a');
      element.setAttribute('href', URL.createObjectURL(file));
      element.setAttribute('download', (currentSave.stats.firstname||"profileResurgence")+".json");
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
    function loadDatas(ev:Event & { currentTarget: EventTarget & HTMLInputElement; })
    {
      if(!ev.currentTarget.files)
        return;
      var v:File=ev.currentTarget.files[0];
      if(v)
      {
        var reader=new FileReader();
        reader.onload=()=>{
          var js=JSON.parse(reader.result?.toString()||"") as SaveFormat
          console.log(js)
          if(js.skin)
            editor.loadSavedOrDefault(js.skin)
          if(js.apparence)
            changePhysicFn(js.apparence.slim,js.apparence.size)
        }
        reader.readAsText(v,"utf-8")
      }
    }
</script>
<div class="h-full overflow-auto w-full">
        <div class="grid gap-6 mb-6 md:grid-cols-2">
          {#if sheetName}
            <div class="col-span-2">
              <p class="text-sm text-primary-500">Sauvgardé dans la fiche: </p>
              <h3 class="text-xl text-center text-secondary-text">{sheetName}</h3>
            </div>
          {/if}
          <Button id="export-button" type="button" class=col-span-2>
           Exporter
           <svg class="w-6 h-6 text-primary-50 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m8 10 4 4 4-4"/>
          </svg>
         
          </Button>
          <Dropdown triggeredBy="#export-button" >
            <DropdownItem class="flex items-center" onclick={saveDatas}>
              Sauvgarder mes paramètres
            </DropdownItem>
            <Tooltip placement="left"  type="dark">Telecharger mes paramètres pour les réutiliser plus tard</Tooltip>
            <DropdownItem class="flex items-center" onclick={exportImage}>
              Télécharger mon skin
            </DropdownItem>
            <Tooltip  placement="left"  type="dark">Telecharger mon skin au format PNG pour l'utilser autre part</Tooltip>
          </Dropdown>
          <Button type="button" class="col-span-2" on:click={()=>{document.getElementById("data_uploader").click()}}>Charger mes paramètres</Button>
          <Tooltip  placement="left"  type="dark">Charger mes paramètres depuis un fichier de sauvegarde</Tooltip>
          <Button class= "grow bg-secondary-text col-span-2" type="button" size="xl" on:click={exporte}>Recuperer mon code</Button>
          <Tooltip  placement="left"  type="dark">Recuperer mon code pour lier mon skin en jeu </Tooltip>
          {#if code}
            <div class="col-span-2">
              <p class="text-primary-800">Copier ce code et collez le dans votre jeu avec Ctrl+ V pour lier ce skin à votre compte.</p>
              <Input class="w-22" type="text" readonly value={code}/>
              <p  class="text-primary-800"> Vous avez <b class="text-secondary-text">{timer}</b> secondes avant de devoir recréer un code</p>
            </div>
          {/if}
        <input hidden type="file" accept=".json" id="data_uploader" onchange={loadDatas}>
      </div>
</div>