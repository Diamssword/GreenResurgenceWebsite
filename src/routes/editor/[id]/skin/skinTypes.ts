import type { ColorRepresentation } from "three"
import type { SkinPart } from "./panel"

export type SaveFormat={
    stats:{
        firstname:string,
        lastname:string,
        age:number,
    },
    apparence:{
        size:number,
        slim:boolean,
    }
    skin:{[key:string]:{
        id:string,
        color?:ColorRepresentation
        height?:number
    }
    }
}
export type SkinPartsFormat={
    
        title:string,
        images:[{id:string,name?:string,cat?:string}],
        type:"face"|"head"|"body",
        layered?:boolean,
        sided?:boolean,
        cats?:{[key:string]:string},
        colors?:ColorRepresentation[]|"free"
    
}
