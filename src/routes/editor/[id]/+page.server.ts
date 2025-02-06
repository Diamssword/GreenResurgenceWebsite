import db from '$lib/DB';
import type { PageServerLoad } from './$types';

export const load = (async (event) => {
    if(!isNaN(event.params.id) && event.locals.user)
    {
        var sheet=db.prepare("SELECT skinlayout.* FROM skinlayout INNER JOIN user ON user.id = skinlayout.user_id WHERE user.id = ? AND skinlayout.id = ?").get(event.locals.user.id,event.params.id);
      return {sheet}
    }
    return {};
}) satisfies PageServerLoad;