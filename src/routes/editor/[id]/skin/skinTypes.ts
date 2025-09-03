import type { LayerInfo } from "$lib/skinviewer3d/skinview3d"

export type SaveFormat={
    stats:{
        firstname:string,
        lastname:string,
        age:number,
        faction:string,
        origine:string,
        job:string,
        points:{[jobID:string]:number}
    },
    apparence:{
        size:number,
        slim:boolean,
    },
    skin:{
        id:string,
        index:number,
        texture?:PickedTextureInfos,
        side?:"right"|"left"
    }[]
}
export type SkinLayerInstance={index:number,texture?:PickedTextureInfos, parent:SkinLayersFormat,side?:"right"|"left"};
export type SkinLayersFormat=LayerInfo &{
        display?:string,
        splited?:boolean,
        multi?:boolean,
        clearable?:boolean,
        cats?:{[key:string]:{name:string,displayGen?:"body"|"bodyfull"|"head"|"headfull"|"headlong"|"face"}},
        displayGen?:"body"|"bodyfull"|"head"|"headfull"|"headlong"|"face"
    
}
export type SkinPartsFormat={
    
        title:string,
        splited?:boolean,
        images?:TextureInfos[],
        cats?:{[key:string]:{name:string,images:TextureInfos[]}},
    
}
export type PickedTextureInfos={
    id:string,
    category?:string,
    subs?:string,
}
export type TextureInfos={
    id:string,
    subs?:TextureInfos[]
    name?:string,
}

export type SkinParts={[key:string]:SkinPartsFormat};
export type Skills={[id: string]: { name: string; desc: string; stages: number[],disabled?:boolean };}
export type Factions={  [id: string]: { name: string; desc: string; bonus: { [key: string]: number };origines: {[key: string]: {name: string;desc: string; skills: { [key: string]: number }; }; };jobs: {[key: string]: {name: string;desc: string;skills: { [key: string]: number }}}}}