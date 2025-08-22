import { error, json, type RequestEvent } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import jwt from 'jsonwebtoken'
export const POST: RequestHandler = async (ev) => {
    
    var js=await ev.request.json();
    if(js.key== process.env.API_TOKEN && process.env.API_KEY)
    {
            var signed=jwt.sign({valid:1},process.env.API_KEY,{expiresIn:"2h"})
            return json({token:signed},{status:200})
    }
    return error(403);
};
