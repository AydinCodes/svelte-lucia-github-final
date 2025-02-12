import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";


export const load: PageServerLoad = async ({locals}) => {
    const session = await locals.session;
    const user = await locals.user;
    if (!session) {
        throw redirect(302, "/login")
    }

    return { user: user };
};