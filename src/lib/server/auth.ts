import { Lucia } from "lucia";
import { dev } from "$app/environment";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { prisma } from '$lib/server/prisma';
import { GitHub } from "arctic";
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from "$env/static/private";



const adapter = new PrismaAdapter(prisma.session, prisma.user);


export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: !dev
		}
	},
	getUserAttributes: (attributes) => {
		return {
			// attributes has the type of DatabaseUserAttributes
			githubId: attributes.github_id,
			username: attributes.username,
			name: attributes.name
		};
	}
});

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

interface DatabaseUserAttributes {
	github_id: number;
	username: string;
	name: string;
}

export const github = new GitHub(
	GITHUB_CLIENT_ID,
	GITHUB_CLIENT_SECRET
);