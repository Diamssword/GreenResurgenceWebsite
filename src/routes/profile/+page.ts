import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (async (data) => {
    
    var dt=await data.parent();
    if(!dt.user)
        throw redirect(302,"/")
   return {sheets:data.data.sheets}
}) satisfies PageLoad;