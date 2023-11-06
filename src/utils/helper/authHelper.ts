import { omit } from 'lodash';
import pick from 'lodash/pick';
import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import connectDB from '#utils/database/connect';
import { createIfNotExist } from '#utils/database/manager';
import { Accounts } from '#utils/database/models/account';
import { Customer } from '#utils/database/models/customer';
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
				fname: { label: 'Name', type: 'text', placeholder: 'Enter your first name' },
				lname: { label: 'Name', type: 'text', placeholder: 'Enter your last name' },
			},
			async authorize (cred) {
				if (!cred?.fname) throw new Error('First name is required');
				if (!cred?.lname) throw new Error('Last name is required');
				if (!cred?.phone) throw new Error('Phone number is required');

				await connectDB();
				const customerCred = {
					fname: cred?.fname,
					lname: cred?.lname,
					phone: cred?.phone,
				};

				const account = await Accounts.findOne({ username: cred?.restaurant }).populate({ path: 'profile', model: Profiles });
				const customer = await createIfNotExist(Customer, { phone: cred?.phone }, customerCred);

				if (!account) throw new Error('Restaurant not found.');
				return {
					role: 'customer',
					customer,
					restaurant: {
						username: account?.profile?.restaurantID,
						name: account?.profile?.name,
						avatar: account?.profile?.avatar,
					},
				};
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
					token.user = user;
				}
			}

			return token;
		},
	},
};
