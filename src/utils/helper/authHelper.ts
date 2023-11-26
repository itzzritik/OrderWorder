import pick from 'lodash/pick';
import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import connectDB from '#utils/database/connect';
import { Accounts } from '#utils/database/models/account';
import { Customers } from '#utils/database/models/customer';
import { Kitchens } from '#utils/database/models/kitchen';
import { Profiles } from '#utils/database/models/profile';
import { Tables } from '#utils/database/models/table';

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
				if (!cred?.username) throw new Error('Restaurant username is required');
				if (!cred?.password) throw new Error('Password is required');

				await connectDB();
				const username = isEmailValid(cred?.username) ? { email: cred?.username } : { username: cred?.username };
				const account = await Accounts.findOne(username)
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
				table: { label: 'Table ID', type: 'string', placeholder: 'Enter the table id' },
				phone: { label: 'Phone Number', type: 'number', placeholder: 'Enter your phone number' },
				fname: { label: 'Name', type: 'text', placeholder: 'Enter your first name' },
				lname: { label: 'Name', type: 'text', placeholder: 'Enter your last name' },
			},
			async authorize (cred) {
				if (!cred?.restaurant) throw new Error('Restaurant id is required');
				if (!cred?.table) throw new Error('Table id is required');
				if (!cred?.fname) throw new Error('First name is required');
				if (!cred?.lname) throw new Error('Last name is required');
				if (!cred?.phone) throw new Error('Phone number is required');

				await connectDB();
				const customerCred = {
					fname: cred?.fname,
					lname: cred?.lname,
					phone: cred?.phone,
				};

				let customer = await Customers.findOne({ phone: cred?.phone });

				if (!customer) customer = await new Customers(customerCred).save();

				const account = await Accounts.findOne({ username: cred?.restaurant })
					.populate({ path: 'profile', model: Profiles })
					.populate({ path: 'tables', model: Tables });

				if (!account) throw new Error('Restaurant not found.');
				if (!account?.tables?.some?.(({ username }: { username: string }) => username === cred?.table))
					throw new Error('Invalid table id');

				return {
					id: '',
					role: 'customer',
					customer,
					restaurant: {
						username: account?.profile?.restaurantID,
						table: cred?.table,
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
			return session;
		},
		async jwt ({ token, user, account }) {
			if (account?.provider === 'restaurant') {
				if (user) {
					token.user = {
						role: user?.role,
						...pick(user._doc, ['email', 'accountActive', 'subscriptionActive:', 'username', 'verified']),
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
