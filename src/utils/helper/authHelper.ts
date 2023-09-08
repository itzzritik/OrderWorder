import { AuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

export const authOptions: AuthOptions = {
	secret: process.env.NEXTAUTH_SECRET,
	providers: [
		GithubProvider({
			clientId: String(process.env.GITHUB_CLIENT_ID),
			clientSecret: String(process.env.GITHUB_CLIENT_SECRET),
			authorization: { params: { scope: 'repo' } },
		}),
	],
	callbacks: {
		async signIn () {
			return true;
		},
		async session ({ session, token }) {
			session = {
				...session,
				user: {
					...session.user,
					...token.user,
				},
				...token.userKey,
			};
			return session;
		},
		async jwt ({ account, profile, token }) {
			if (profile) {
				token.user = {
					email: profile?.email,
					bio: profile?.bio,
					blog: profile?.blog,
					followers: profile?.followers,
					following: profile?.following,
					public_repos: profile?.public_repos,
					public_gists: profile?.public_gists,
					social: {
						github: profile?.login,
						twitter: profile?.twitter_username,
					},
				};
				token.userKey = {
					token_type: account?.token_type,
					access_token: account?.access_token,
				};
			}
			return token;
		},
	},
};
