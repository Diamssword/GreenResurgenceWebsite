import db, { type SkinLayout } from '$lib/DB';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import ShortUniqueId from 'short-unique-id';

import { account_linking } from '$lib/server_functions';
import dayjs from 'dayjs';

const uid = new ShortUniqueId({ length: 6 });
export const load = (async (ev) => {
    if(ev.locals.user)
    {
        var r:SkinLayout[]=db.prepare("SELECT skinlayout.* FROM skinlayout INNER JOIN user ON user.id = skinlayout.user_id WHERE user.id = ?").all(ev.locals.user.id);
       return {sheets:r}
    }
    return {};
}) satisfies PageServerLoad;
export const actions = {
    username: async (event) => {

        var res = await event.request.text();
        if (res.length > 1 && res.length < 400 && event.locals.user) {
            db.prepare("UPDATE user SET username = ? WHERE id = ?").run(res, event.locals.user.id);
            return {};
        }
        else
            return fail(401);
    },
    create:async(event)=>{
        if(event.locals.user)
        {
            var ob= await event.request.json()
            if(ob.name && ob.name.length>1 && ob.lastname && ob.lastname.length>1)
            {
                var dt={stats:{firstname:ob.name,lastname:ob.lastname,points:{}},appearence:{}}
                var res=db.prepare("INSERT INTO skinlayout ( user_id, name,data) VALUES (?, ?, ?)").run(event.locals.user.id,ob.name+" "+ob.lastname,JSON.stringify(dt));
                return {id:res.lastInsertRowid,name:ob.name+" "+ob.lastname}
            }
        }
        else
        return fail(401);
    },
    rename:async(event)=>{
        if(event.locals.user)
        {
            var txt= await event.request.json()
            if(txt.name.length>1 && txt.id)
            {
                var res=db.prepare("UPDATE skinlayout SET name = ? WHERE id= ? and user_id = ?").run(txt.name,txt.id,event.locals.user.id);
                return {}
            }
        }
        else
        return fail(401);
    },
    delete:async(event)=>{
        if(event.locals.user)
        {
            var id= await event.request.text()
            if(id.length>0)
            {
                var res=db.prepare("DELETE FROM skinlayout WHERE id= ? and user_id = ?").run(id,event.locals.user.id);
                return {}
            }
        }
        else
        return fail(401);
    }
} satisfies Actions;
setInterval(() => {
    for (var k in account_linking) {
        if (account_linking[k].expire.isBefore(dayjs())) {
            delete account_linking[k];
        }
    }
}, 5000)