import type { RequestEvent } from "@sveltejs/kit";
import type dayjs from "dayjs";
import jwt from "jsonwebtoken"

export const skin_datas:{[key:string]:{code:string,expire:dayjs.Dayjs}}={};
export const account_linking:{[key:string]:{code:string,expire:dayjs.Dayjs}}={};
export function checkAPIAuth(event :RequestEvent)
{
    var auto=event.request.headers.get("authorization");
    if(auto && process.env.API_KEY)
    {
        try{
            if(jwt.verify(auto,process.env.API_KEY))
                return true;
        }catch(err)
        {
            return false;
        }
    }
}