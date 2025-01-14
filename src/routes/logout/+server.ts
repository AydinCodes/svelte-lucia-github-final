import { redirect } from "@sveltejs/kit";
import { lucia } from "$lib/server/auth";

import type { RequestEvent } from "@sveltejs/kit";

export async function GET(event: RequestEvent): Promise<Response> {
	if (!event.locals.session) {
        redirect(302, "/login");
    }
    await lucia.invalidateSession(event.locals.session.id);
    const sessionCookie = lucia.createBlankSessionCookie();
    event.cookies.set(sessionCookie.name, sessionCookie.value, {
        path: ".",
        ...sessionCookie.attributes
    });

    event.cookies.delete("github_oauth_state", {path: "/"})

    redirect(302, "/");
}