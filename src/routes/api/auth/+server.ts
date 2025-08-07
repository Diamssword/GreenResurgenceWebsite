import { error, json, type RequestEvent } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import jwt from 'jsonwebtoken'
export const POST: RequestHandler = async (ev) => {
    
    var js=await ev.request.json();
    if(js.key==import.meta.env.API_TOKEN)
    {
            var signed=jwt.sign({valid:1},import.meta.env.API_KEY,{expiresIn:"2h"})
            return json({token:signed},{status:200})
    }
    return error(301);
};
