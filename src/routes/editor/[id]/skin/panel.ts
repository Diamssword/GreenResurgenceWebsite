import type { ColorRepresentation } from "three";
import type { SkinPartsFormat } from "./skinTypes";
import type {LayerInfo, SkinViewer} from "$lib/skinviewer3d/skinview3d";
import type { PageData } from "../$types";

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
    viewer:SkinViewer;
    constructor(skinLib:PageData["datas"],viewer:SkinViewer) {
        this.skinLib=skinLib;
        this.pickedLayers={}
        this.viewer=viewer;
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
    loadSavedOrDefault(saved:{[key:string]:{color?:string,texture?:string}})
    {
        if(this.skinLib)
        {
           
            for(let k in this.skinLib)
            {
                if(this.pickedLayers[k])
                {
                if(saved[k])
                {
                    if(saved[k].color)
                    {
                        if(this.skinLib[k]?.colors!=undefined)
                            this.pickedLayers[k].color=saved[k].color;
                    }
                    this.pickedLayers[k].texture=saved[k].texture;
                }
                else
                   this.pickedLayers[k].texture=this.skinLib[k].images[0].id;
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
        if(lib)
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
                this.viewer.loadSkin(cat,"/skins/"+this.getTexturePath(cat,text),{color,side})
            if(childLayers[cat])
            {
                if(lib.layered)
                    color=undefined;
                this.viewer.loadSkin(childLayers[cat],"/skins/"+this.getTexturePath(childLayers[cat],text),{color,side})
            }
        }
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
}
