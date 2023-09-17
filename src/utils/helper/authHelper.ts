import pick from 'lodash/pick';
import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import connectDB from '#utils/database/connect';
import { Accounts } from '#utils/database/models/account';
import { Profiles } from '#utils/database/models/profile';

import { isEmailValid } from './common';
import { verifyPassword } from './passwordHelper';

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
				await connectDB();
				const username = cred?.username;
				const user = await Accounts.findOne(isEmailValid(username) ? { email: username } : { username })
					.populate({ path: 'profile', model: Profiles });

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
					...pick(user._doc, ['email', 'accountActive', 'subscriptionActive:', 'username', 'verified']),
					profile: pick(user._doc.profile, ['name', 'themeColor', 'address', 'avatar', 'description', 'gstInclusive', 'categories']),
				};
			}
			return token;
		},
	},
};
