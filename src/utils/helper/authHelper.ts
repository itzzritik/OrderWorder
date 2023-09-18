import pick from 'lodash/pick';
import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import connectDB from '#utils/database/connect';
import { Accounts } from '#utils/database/models/account';
import { Kitchens } from '#utils/database/models/kitchen';
import { Profiles } from '#utils/database/models/profile';

import { isEmailValid } from './common';
import { verifyPassword } from './passwordHelper';

export const authOptions: AuthOptions = {
	secret: process.env.NEXTAUTH_SECRET,
	providers: [
		CredentialsProvider({
			name: 'credentials',
			credentials: {
				username: { label: 'Username', type: 'text', placeholder: 'Enter your username or email' },
				kitchen: { label: 'Kitchen Username', type: 'text', placeholder: 'Enter your kitchen username' },
				password: { label: 'Password', type: 'password', placeholder: 'Enter your password' },
			},
			async authorize (cred) {
				await connectDB();
				const username = isEmailValid(cred?.username) ? { email: cred?.username } : { username: cred?.username };
				const account = await Accounts.findOne(username)
					.populate({ path: 'profile', model: Profiles })
					.populate({ path: 'kitchens', model: Kitchens, match: { username: cred?.kitchen } });

				if (!account) throw new Error('Account not found.');
				console.log('Cred Kitchen', typeof cred?.kitchen);
				if (cred?.kitchen) {
					if (!verifyPassword(cred?.password, account?.kitchens?.[0]?.password)) throw new Error('Invalid kitchen credentials');

					return {
						id: account._id.toString(),
						role: 'kitchen',
						...account,
					};
				}
				else {
					if (!verifyPassword(cred?.password, account?.password)) throw new Error('Invalid admin credentials');

					return {
						id: account._id.toString(),
						role: 'admin',
						...account,
					};
				}
			},
		}),
	],
	session: { strategy: 'jwt' },
	callbacks: {
		async session ({ session, token }) {
			session = {
				...session,
				...token?.user,
			};
			delete session.user;
			return session;
		},
		async jwt ({ token, user }) {
			if (user) {
				token.user = {
					role: user?.role,
					...pick(user._doc, ['email', 'accountActive', 'subscriptionActive:', 'username', 'verified']),
					profile: pick(user._doc.profile, ['name', 'themeColor', 'address', 'avatar', 'description', 'gstInclusive', 'categories']),
				};
			}
			return token;
		},
	},
};
