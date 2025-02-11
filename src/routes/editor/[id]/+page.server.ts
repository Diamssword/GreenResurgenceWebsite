import db from '$lib/DB';
import type { PageServerLoad } from './$types';
import type { SaveFormat } from './skin/skinTypes';

export const load = (async (event) => {
    if(!isNaN(event.params.id) && event.locals.user)
    {
        var sheet=db.prepare("SELECT skinlayout.* FROM skinlayout INNER JOIN user ON user.id = skinlayout.user_id WHERE user.id = ? AND skinlayout.id = ?").get(event.locals.user.id,event.params.id) as any;
        if(sheet && sheet.id)
        {
          return {
            sheet:{
              id:sheet.id as number,
              name:sheet.name as string,
              data:JSON.parse(sheet.data) as SaveFormat
            }
          }
        }
    }
    return {};
}) satisfies PageServerLoad;