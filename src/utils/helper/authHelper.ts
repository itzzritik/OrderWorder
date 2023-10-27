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
			id: 'restaurant',
			name: 'restaurant',
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
		CredentialsProvider({
			id: 'customer',
			name: 'customer',
			credentials: {
				restaurant: { label: 'Restaurant Username', type: 'text', placeholder: 'Enter restaurant username' },
				phone: { label: 'Phone Number', type: 'number', placeholder: 'Enter your phone number' },
				name: { label: 'Name', type: 'text', placeholder: 'Enter your name' },
			},
			async authorize (cred) {
				await connectDB();
				const account = await Accounts.findOne({ username: cred?.restaurant });

				if (!account) throw new Error('Restaurant not found.');

				return pick(cred, ['restaurant', 'phone', 'name']);
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
			console.log(session);
			return session;
		},
		async jwt ({ token, user, account }) {
			if (account?.provider === 'restaurant') {
				if (user) {
					token.user = {
						role: user?.role,
						...pick(user._doc, ['email', 'accountActive', 'subscriptionActive:', 'username', 'verified']),
						profile: pick(user._doc.profile, ['name', 'themeColor', 'address', 'avatar', 'description', 'gstInclusive', 'categories']),
					};
				}
			}

			if (account?.provider === 'customer') {
				if (user) {
					token.user = {
						...user,
						role: 'customer',
					};
				}
			}

			return token;
		},
	},
};
