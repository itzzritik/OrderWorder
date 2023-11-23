import 'next-auth';

import { TAccount } from '#utils/database/models/account';
import { TCustomer } from '#utils/database/models/customer';
import { TProfile } from '#utils/database/models/profile';
import { TTable } from '#utils/database/models/table';

type AuthUser = Partial<Omit<TAccount, 'profile'> & {
	role: 'admin' | 'kitchen' | 'customer'
	customer: Partial<TCustomer>,
	restaurant: Partial<{
		username: TProfile.username,
		table: TTable.username,
		name: TProfile.name,
		avatar: TProfile.avatar,
	}>
}>

declare module 'next-auth' {
	interface User {
		role: 'admin' | 'kitchen' | 'customer'
		_doc: AuthUser
	}

	interface Session extends AuthUser {
		expires: string;
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		user: AuthUser
	}
}
