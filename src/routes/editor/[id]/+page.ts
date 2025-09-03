
import type { PageLoad } from './$types';
export const load = (async (ev) => {
        return {sheet:ev.data.sheet};
}) satisfies PageLoad;
