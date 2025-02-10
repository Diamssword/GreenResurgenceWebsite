<script lang="ts">
    import { Button, Input, Label, Toggle, Tooltip,Select } from 'flowbite-svelte'; 
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import { SkinViewer } from '$lib/skinviewer3d/viewer';
    import { exportCharacter, SkinEditor } from './panel';
    import type { SaveFormat } from './skinTypes';
    type Props={
      changePhysicFn:(slim:boolean,taille:number)=>void
    currentSave:SaveFormat
    editor:SkinEditor;
    }
    var {changePhysicFn,editor,currentSave}:Props=$props();
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
    <form >
        <div class="grid gap-6 mb-6 md:grid-cols-2">
          
      
          <Button type="button" on:click={saveDatas}>Sauvgarder mes paramètres</Button>
          <Tooltip type="light">Telecharger mes paramètres pour les réutiliser plus tard</Tooltip>
          <Button type="button" on:click={()=>{document.getElementById("data_uploader").click()}}>Charger mes paramètres</Button>
          <Tooltip type="light">Charger mes paramètres depuis un fichier de sauvegarde</Tooltip>
          <Button class= "grow bg-secondary-text" type="button" size="xl" on:click={exporte}>Recuperer mon code</Button>
          <Tooltip type="light">Recuperer mon code pour lier mon skin en jeu </Tooltip>
          <Button type="button" on:click={exportImage}>Telecharger mon skin</Button>
          <Tooltip type="light">Telecharger mon skin au format PNG pour l'utilser autre part</Tooltip>
          {#if code}
          <div class="col-span-2">
            <p class="text-primary-800">Copier ce code et collez le dans votre jeu avec Ctrl+ V pour lier ce skin à votre compte.</p>
            <Input class="w-22" type="text" readonly value={code}/>
            <p  class="text-primary-800"> Vous avez <b class="text-secondary-text">{timer}</b> secondes avant de devoir recréer un code</p>
          </div>
          {/if}
      </form>
      <input hidden type="file" id="data_uploader" onchange={loadDatas}>
</div>