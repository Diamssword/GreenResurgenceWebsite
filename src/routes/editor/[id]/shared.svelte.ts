import type { SaveFormat } from "./skin/skinTypes";

export const currentAppearence = $state({data:{} as SaveFormat,isLoaded:false as boolean,listeners:[] as (()=>void)[]});