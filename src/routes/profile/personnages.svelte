<script lang="ts">
    import type { SkinLayout } from "$lib/DB";
    import Popup from "$lib/component/popup.svelte";
    import dayjs from "dayjs";
    import 'dayjs/locale/fr'
    import relativeTime  from 'dayjs/plugin/relativeTime'
    import utc  from 'dayjs/plugin/utc'
    import timezone  from 'dayjs/plugin/timezone'
    dayjs.locale("fr");
    dayjs.extend(relativeTime);
    dayjs.extend(utc);
    dayjs.extend(timezone);
    import { Button, Input, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from "flowbite-svelte";
    let {sheets=[]}:{sheets:SkinLayout[]}=$props();
    var creating=$state(false);
    var deleting=$state(false);
    var renaming=$state(-1);
    var pickedForDelete:{id:number,index:number}=$state()
    var datas=$state(sheets.sort((a,b)=>new Date(b.edit_at)-new Date(a.edit_at)))
    var creatingName=$state("");
    var modifName=$state("");
    function onCreate()
    {
        if(creating)
        {
            if(creatingName.length>1)
            {
                fetch("?/create",{method:"POST",body:creatingName}).then(async e=>{
                    if(e.status==200)
                    {
                        var res=JSON.parse((await e.json()).data);
                        datas=[{id: res[1],name:res[2],data:"{}",edit_at:new Date(),user_id:0},...datas];
                        sheets=datas;
                        creating=false
                        creatingName="";
                    }
                    
                })
            }
        }
        creating=true
    }
    function onDelete(id:number,key:number)
    {
        fetch("?/delete",{method:"POST",body:id.toString()}).then(async e=>{
            if(e.status==200)
            {
                datas.splice(key,1);
                sheets=datas;
            }
        })
    }
    function onRename(id:number,index:number,name:string)
    {
        if(renaming !=index)
        {
            renaming=index
            modifName=name;
        }
        else
        {
            fetch("?/rename",{method:"POST",body:JSON.stringify({id,name:modifName})}).then(async e=>{
                if(e.status==200)
                {
                    datas[index].name=modifName;
                    sheets=datas;
                    renaming=-1;
                }
            })
         
        }
    }
</script>
<div>
    <div class=" mb-3 flex">
    {#if creating}
        <Input class="w-60 mr-4" placeholder="Nouveau Nom" bind:value={creatingName}/>
    {/if}
        <Button class="bg-secondary-text" onclick={onCreate}>+ {creating?"Créer":"Nouveau"}</Button>
 
    </div>
    <Table>
    <TableHead  class="bg-primary-400">
        <TableHeadCell padding="px-4 py-3" scope="col">Nom</TableHeadCell>
        <TableHeadCell padding="px-4 py-3" scope="col">Modifié</TableHeadCell>
        <TableHeadCell padding="px-4 py-3" scope="col">Actions</TableHeadCell>
      </TableHead>
      <TableBody class="divide-y">
          {#each datas as item, i}
            <TableBodyRow class="bg-primary-300">
                <TableBodyCell tdClass="px-4 py-3">
                {#if renaming==i}
                    <Input class="w-60 mr-4" placeholder="Nouveau Nom" bind:value={modifName}/>
                {:else}
                    {item.name}
                {/if}
              </TableBodyCell>
              <TableBodyCell tdClass="px-4 py-3">{dayjs.utc(item.edit_at).local().fromNow(false)}</TableBodyCell>
              <TableBodyCell tdClass="px-4 py-3">
                <Button class="bg-secondary-text mr-2" href="/editor/{item.id}">Editer</Button>
                <Button class="bg-secondary-text1 mr-2" onclick={()=>onRename(item.id,i,item.name)}>{renaming==i?"Confirmer":"Renommer"}</Button>
                <Button color="red" onclick={()=>{pickedForDelete={id:item.id,index:i}; deleting=true}}>Supprimer</Button></TableBodyCell>
            </TableBodyRow>
          {/each}
      </TableBody>
    </Table>
</div>
<Popup open={deleting} onClose={(yes)=>{
    if(yes)
        onDelete(pickedForDelete.id,pickedForDelete.index)
    deleting=false;
}}>
    Voulez vous définitivement supprimer ce personnage?
</Popup>