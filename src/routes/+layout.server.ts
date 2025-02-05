import type { LayoutServerLoad } from './$types';

export const load = (async (req) => {
    return {user:req.locals.user};
}) satisfies LayoutServerLoad;