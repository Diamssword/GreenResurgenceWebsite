<script lang="ts">
    import { Button, Input, Label, Tooltip } from 'flowbite-svelte'; 

    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    export var ldSkinFn:(data:any)=>void
    export var imgFunction:(allLayers?:boolean)=>string;
    export var dtFn:()=>any;
    export var exptFn:(dt:any,)=>Promise<string>;
    var nom:string;
    var prenom:string;
    var age:number;
    var taille:number;
    var code:string|undefined;
    var timer=0;
    var int: NodeJS.Timeout | undefined;
    function exporte()
    {
      exptFn({nom,prenom,age,taille}).then(e=>{
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
    
    onMount(()=>{
      if(browser)
      {
        let saved= JSON.parse(window.localStorage.getItem("skin_builder_profile")||"{}");    
          nom=saved.nom||""
          prenom=saved.prenom||""
          age=saved.age||20
          taille=saved.taille||50
      }
    })
    $: if(nom || prenom|| age || taille)
    {
      if(browser)
      {

        window.localStorage.setItem("skin_builder_profile",JSON.stringify({nom,prenom,age,taille}))
        
      }
    
    }
    function exportImage()
    {
      var dt=imgFunction(true);
      var element = document.createElement('a');
      element.setAttribute('href', dt);
      element.setAttribute('download', (nom||"skin")+".png");
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
    function saveDatas()
    {
      var skin=dtFn();
      var profile={nom,prenom,age,taille};
      var file = new Blob([JSON.stringify({skin,profile})], {type: "text/json"});
      var element = document.createElement('a');
      element.setAttribute('href', URL.createObjectURL(file));
      element.setAttribute('download', (nom||"profileResurgence")+".json");
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
    function loadDatas(ev:InputEvent)
    {
      var fn=(d:any)=>{
          nom=d.nom||"";
          prenom=d.prenom||"";
          age=d.age||20;
          taille=d.taille||50;
      }
      var v:File=ev.target.files[0];
      if(v)
      {
        
        var reader=new FileReader();
        reader.onload=()=>{
          var js=JSON.parse(reader.result)
         fn(js.profile);
         ldSkinFn(js.skin||{})
         ev.target.files=[]
        }
        reader.readAsText(v,"utf-8")
      }
    }
    var form:HTMLFormElement;
</script>
<div class="h-full overflow-auto w-full">
    <form bind:this={form}>
        <div class="grid gap-6 mb-6 md:grid-cols-2">
          <div>
            <Label for="first_name" class="mb-2 text-primary-text">Prénom</Label>
            <Input type="text" id="first_name" placeholder="John" bind:value={prenom} required />
          </div>
          <div>
            <Label for="last_name" class="mb-2 text-primary-text" >Nom</Label>
            <Input type="text" id="last_name" placeholder="Doe" required bind:value={nom}/>
          </div>
          <div>
            <Label for="taille" class="mb-2 text-primary-text" >Taille</Label>
            <div class=" flex">
              <p class="text-gray-100 content-center mr-1">1m</p>
              <Input class="w-22" type="number" min=40 max=99 id="taille" placeholder={Math.floor(40+(Math.random()*45))} required bind:value={taille}/>
            </div>
          </div>
          <div>
            <Label for="age" class="mb-2 text-primary-text">Age</Label>
            <div class=" flex">
              <Input class="w-22" type="number" id="age" min=10 max=120 placeholder={Math.floor(16+(Math.random()*20))} required bind:value={age}/>
              <p class="ml-2 text-gray-100 content-center">ans</p>
            </div>
            
          </div>
          <Button type="button" on:click={saveDatas}>Sauvgarder mes paramètres</Button>
          <Tooltip type="light">Telecharger mes paramètres pour les réutiliser plus tard</Tooltip>
          <Button type="button" on:click={()=>{document.getElementById("data_uploader").click()}}>Charger mes paramètres</Button>
          <Tooltip type="light">Charger mes paramètres depuis un fichier de sauvegarde</Tooltip>
          <Button class= "grow bg-primary-text" type="button" size="xl" on:click={exporte}>Recuperer mon code</Button>
          <Tooltip type="light">Recuperer mon code pour lier mon skin en jeu </Tooltip>
          <Button type="button" on:click={exportImage}>Telecharger mon skin</Button>
          <Tooltip type="light">Telecharger mon skin au format PNG pour l'utilser autre part</Tooltip>
          {#if code}
          <div class="col-span-2">
            <p class="text-primary-text1">Copier ce code et collez le dans votre jeu avec Ctrl+ V pour lier ce skin à votre compte.</p>
            <Input class="w-22" type="text" readonly value={code}/>
            <p  class="text-primary-text1"> Vous avez <b class="text-primary-text">{timer}</b> secondes avant de devoir recréer un code</p>
          </div>
          {/if}
      </form>
      <input hidden type="file" id="data_uploader" on:change={loadDatas}>
</div>