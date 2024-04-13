import { OAuth2RequestError } from "arctic";
import { generateId } from "lucia";
import { github, lucia } from "$lib/server/auth";

import type { RequestEvent } from "@sveltejs/kit";

export async function GET(event: RequestEvent): Promise<Response> {
	const code = event.url.searchParams.get("code");
	const state = event.url.searchParams.get("state");
	const storedState = event.cookies.get("github_oauth_state") ?? null;

	if (!code || !state || !storedState || state !== storedState) {
		return new Response(null, {
			status: 400
		});
	}

	try {
		const tokens = await github.validateAuthorizationCode(code);
		const githubUserResponse = await fetch("https://api.github.com/user", {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`
			}
		});
		const githubUser: GitHubUser = await githubUserResponse.json();

        console.log(githubUser)

		// Replace this with your own DB client.
		const existingUser = await prisma.user.findFirst({
            where: {
                githubId: githubUser.id
            }
        })

		if (existingUser) {
			const session = await lucia.createSession(existingUser.id, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: ".",
				...sessionCookie.attributes
			});
		} else {
			const userId = generateId(15);

			// Replace this with your own DB client.
			await prisma.user.create({
                data: {
                    id: userId,
                    githubId: githubUser.id,
                    username: githubUser.login,
                    name: githubUser.name
                }
            })

			const session = await lucia.createSession(userId, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: ".",
				...sessionCookie.attributes
			});
		}
		return new Response(null, {
			status: 302,
			headers: {
				Location: "/dashboard"
			}
		});
	} catch (e) {
		// the specific error message depends on the provider
		if (e instanceof OAuth2RequestError) {
			// invalid code
			return new Response(null, {
				status: 400
			});
		}
		return new Response(null, {
			status: 500
		});
	}
}

interface GitHubUser {
	id: number;
	login: string;
    name: string;
}