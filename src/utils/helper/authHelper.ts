import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import { verifyPassword } from '#utils/database/manager';
import { Accounts, TAccount } from '#utils/database/models/account';

import { isEmailValid } from './common';

export const authOptions: AuthOptions = {
	secret: process.env.NEXTAUTH_SECRET,
	providers: [
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				username: { label: 'Username', type: 'text', placeholder: 'Enter your username or email' },
				password: { label: 'Password', type: 'password', placeholder: 'Enter your password' },
			},
			async authorize (cred) {
				const username = cred?.username;
				const user = await Accounts.findOne<TAccount>(isEmailValid(username) ? { email: username } : { username });

				if (!user) throw new Error('Account not found.');
				if (!verifyPassword(cred?.password, user?.password)) throw new Error('Invalid credentials');

				return {
					id: user._id.toString(),
					...user,
				};
			},
		}),
	],
	session: {
		strategy: 'jwt',
	},

	// callbacks: {
	// 	async signIn () {
	// 		return true;
	// 	},
	// 	async session ({ session, token }) {
	// 		session = {
	// 			...session,
	// 			user: {
	// 				...session.user,
	// 				...token.user,
	// 			},
	// 			...token.userKey,
	// 		};
	// 		return session;
	// 	},
	// 	async jwt ({ account, profile, token }) {
	// 		if (profile) {
	// 			token.user = {
	// 				email: profile?.email,
	// 				bio: profile?.bio,
	// 				blog: profile?.blog,
	// 				followers: profile?.followers,
	// 				following: profile?.following,
	// 				public_repos: profile?.public_repos,
	// 				public_gists: profile?.public_gists,
	// 				social: {
	// 					github: profile?.login,
	// 					twitter: profile?.twitter_username,
	// 				},
	// 			};
	// 			token.userKey = {
	// 				token_type: account?.token_type,
	// 				access_token: account?.access_token,
	// 			};
	// 		}
	// 		return token;
	// 	},
	// },
};
