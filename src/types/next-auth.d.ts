import 'next-auth';

interface User {
	email?: string;
	bio?: string;
	blog?: string;
	followers?: number;
	following?: number;
	public_repos?: number;
	public_gists?: number;
	social?: {
		github?: string,
		twitter?: string
	}
}

declare module 'next-auth' {
	interface Profile extends User {
		login: string;
		twitter_username: string;
	}

	interface Session {
		user: User & {
			name: string;
			image: string;
		};
		token_type?: string,
		access_token?: string,
		expires: string;
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		user: User,
		userKey: {
			token_type?: string,
			access_token?: string,
		};
	}
}
