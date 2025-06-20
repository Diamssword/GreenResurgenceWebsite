import type { ColorRepresentation } from "three";
import type { SaveFormat, SkinPartsFormat } from "./skinTypes";
import type {LayerInfo, SkinViewer} from "$lib/skinviewer3d/skinview3d";
import type { PageData } from "../$types";
import { browser } from "$app/environment";
import { SHARED } from "$lib/sharedDatas";

const defaultColors:{[key:string]:ColorRepresentation}={
    "left_eye":"#126A87",
    "right_eye":"#126A87",
}
const libConverter:{[key:string]:string}={
    "left_eye":"eyes",
    "right_eye":"eyes",
}
const childLayers:{[key:string]:string}={
    "left_eye":"left_eye_c",
    "right_eye":"right_eye_c",
}
export const layers:LayerInfo[]=[
    {name:"base",size:0},
    {name:"underwear",size:0.1,external:true},
    {name:"mouth",size:0.01},
    {name:"beard",size:0.02,external:true},
    {name:"left_eye",size:0.03},
    {name:"left_eye_c",size:0.03},
    {name:"right_eye",size:0.03},
    {name:"right_eye_c",size:0.03},
    {name:"left_cosmetic",size:0.06},
    {name:"right_cosmetic",size:0.06},
    {name:"cosmetic",size:0.08},
    {name:"hair",size:0.07,external:true}
]
export enum SkinPart{
    base="base",
    underwear="underwear",
    mouth="mouth",
    beard="beard",
    left_eye="left_eye",
    right_eye="right_eye",
    left_cosmetic="left_cosmetic",
    right_cosmetic="right_cosmetic",
    cosmetic="cosmetic",  
    hair="hair",  
}
export class SkinEditor {
    skinLib: { [key: string]: SkinPartsFormat; };
    pickedLayers:{[key:string]:{color?:ColorRepresentation,texture?:string}};
    viewer?:SkinViewer;
    slim?:boolean
    saveFn:(data:SaveFormat["skin"])=>void;
    constructor(skinLib:PageData["datas"]) {
        this.skinLib=skinLib;
        this.pickedLayers={}
        this.viewer=undefined;
        this.saveFn=()=>{}
       for(let layer in SkinPart)
       {
        this.pickedLayers[layer]={};
       }
    }
    pickColor(cat:string,color:ColorRepresentation)
    {
        this.pickedLayers[cat].color=color;
        this.reloadPart(cat);
    }
    pickTexture(cat:string,texture:string)
    {
        this.pickedLayers[cat].texture=texture;
        this.reloadPart(cat);
    }
    getPickedTexture(cat:string)
    {
        var ret=this.pickedLayers[cat].texture;
        if(!ret)
            return this.getLib(cat).images[0];
        return ret;
    }
    getPickedColor(cat:string)
    {
        return this.pickedLayers[cat].color||this.getDefaultColor(cat);       
    }
    private getDefaultColor(cat:string) {
        let lib=this.getLib(cat);
        if(lib.colors  && lib.colors !="free" && lib.colors.length>0)
            return lib.colors[0];
        return defaultColors[cat];
    }
    loadSavedOrDefault(saved:SaveFormat["skin"])
    {
        if(this.skinLib)
        {
            for(let layer in SkinPart)
            {
                var lib=this.getLib(layer)
                if(this.pickedLayers[layer])
                {
                    if(saved[layer])
                    {
                        
                        if(saved[layer].color)
                        {
                            if(lib?.colors!=undefined)
                                this.pickedLayers[layer].color=saved[layer].color;
                        }
                        this.pickedLayers[layer].texture=saved[layer].id;
                    }
                    else
                    this.pickedLayers[layer].texture=lib?.images[0].id;
                }
            }
            for(let k in SkinPart)
            {
                this.reloadPart(k);
            }
            
        }
    }
    clearPart(cat:string)
    {
        this.pickedLayers[cat].texture=undefined;
        this.reloadPart(cat);
    }
    reloadPart(cat:string)
    {
        var lib=this.getLib(cat)
        if(lib && this.viewer)
        {
            var text=this.pickedLayers[cat].texture||"clear";
            var side:undefined|"left"|"right"=undefined;
            if(lib.sided)
            {
                side=cat.includes("right")?"right":"left";
            }
            var color:ColorRepresentation|undefined=undefined;
            if(lib.colors)
            {
                color=this.pickedLayers[cat].color;
                if(!color && lib.colors !="free")
                     color=lib.colors[0];
                else if(!color)
                    color=defaultColors[cat];
            }
           if(text=="clear")
                this.viewer.loadSkin(cat,"/skins/clear.png")
            else
                this.viewer.loadSkin(cat,"/skins/"+this.getTexturePath(cat,text),{color,side,model:this.slim?"slim":"default"})
            if(childLayers[cat])
            {
                if(lib.layered)
                    color=undefined;
                try{
                this.viewer.loadSkin(childLayers[cat],"/skins/"+this.getTexturePath(childLayers[cat],text),{color,side,model:this.slim?"slim":"default"})
                }catch{}
            }
            this.saveFn?.(this.toJson())
        }
    }
    toJson()
    {
        var res:SaveFormat["skin"]={}
        for (let k in SkinPart) {
            
            var r=this.pickedLayers[k];
            if(r && r.texture)
            {
                res[k]={id:r.texture,color:r.color||this.getDefaultColor(k)};
            }
        }
        return res;
    }
    getLib(cat:string)
    {
        if(libConverter[cat])
            return this.skinLib[libConverter[cat]];
        return this.skinLib[cat]
    }
    getTexturePath(cat:string,texture:string)
    {
        var c=false;
        if(cat.endsWith("_c"))
        {
            cat=cat.substring(0,cat.length-2);
            c=true;
        }
        let lib=this.getLib(cat);
        let pt=cat;
        if(lib.sided)
        {
            if(libConverter[cat])
                pt=libConverter[cat]
            else
                pt=pt.replace("left_","").replace("right_","")
        }
            
        if(lib.layered && c)
            texture=texture+"b";
        return pt+"/"+texture+".png"
    }
    toPNG(allLayers?:boolean)
    {
        var canv=document.createElement("canvas")
        canv.width=canv.height=128;
        var ctx=canv.getContext("2d");
        layers.forEach(l=>{
            if(l.external !=true || allLayers ==true)
            {
                if(this.viewer)
                {
                var c1=this.viewer.skinCanvas[l.name];
                ctx?.drawImage(c1,0,0);
                }
            }
        });
        ctx?.save();
        return canv.toDataURL("png");
    }
    toPNGHead(allLayers?:boolean)
    {
        var canv=document.createElement("canvas")
        canv.width=canv.height=16;
        var ctx=canv.getContext("2d");
        layers.forEach(l=>{
            if(l.external !=true || allLayers ==true)
            {
                if(this.viewer)
                {
                var c1=this.viewer.skinCanvas[l.name];
                ctx?.drawImage(c1,16,16,16,16,0,0,16,16);
                }
            }
        });
        ctx?.save();
        return canv.toDataURL("png");
    }
}
export function getProfileSaver(sheetId:number,datas:SaveFormat)
{
    var timeout: NodeJS.Timeout;
    if(!datas.apparence)
        datas.apparence={size:40,slim:false};
    if(!datas.skin)
        datas.skin={};
    if(!datas.stats)
        datas.stats={};
    return {
        loader:()=>datas,
        saver:(data:SaveFormat)=>{
            if(timeout)
                clearTimeout(timeout);
            timeout=setTimeout(() => {
                fetch("",{method:"POST",body:JSON.stringify({
                    action:"save",
                    sheet:sheetId,
                    datas:data
                })}).then(e=>{
                    if(e.status!=200)
                        SHARED.update(o=>{
                            return {...o,error:"Impossible de sauvgarder le skin"}
                        })
                })
            }, 1000);
        }
    }
}
export var localLoader=()=>{
    if(browser)
    {
        var str=window.localStorage.getItem("skin_builder_datas");
        if(str !=null)
        {
        try{
            
              return JSON.parse(str)as SaveFormat
                
            }catch{
                return {apparence:{},skin:{},stats:{}} as SaveFormat;
            }  
        }
    }
    return {apparence:{},skin:{},stats:{}} as SaveFormat;
}
export function localSaver(data:SaveFormat)
{
    console.log(data)
    if(browser)
    {
        window.localStorage.setItem("skin_builder_datas",JSON.stringify(data))
    }
}
export function exportCharacter(skinEditor:SkinEditor,profile:SaveFormat)
{
    return new Promise<string>((res,err)=>{
        var dt=skinEditor.toPNG();
        var head=skinEditor.toPNGHead(true);
            fetch("",{method:"post", body:JSON.stringify({
                action:"export",
                datas:formatSendingDatas(profile),
                image:dt,
                head: head       
        })}).then(r=>{
            if(r.status==200)
                r.text().then(res)
            else
            err();
        })
    });
   
}
function formatSendingDatas(profile:SaveFormat)
{
    var res= {
        hair:profile.skin["hair"]?.id||"bald",
        hairColor:profile.skin["hair"]?.color?.toString().replace("#","")||"5D3A1A",
        underwear:profile.skin["underwear"].id,
        size:profile.apparence.size,
        slim:profile.apparence.slim,
        stats:profile.stats
    } as any
    if(profile.skin["beard"] && profile.skin["beard"].id !="clear")
    {
        res.beard=profile.skin["beard"].id;
        res.beardColor=profile.skin["beard"].color?.toString().replace("#","");
    }
    return res;
}
