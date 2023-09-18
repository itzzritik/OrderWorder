import 'next-auth';

import { TAccount } from '#utils/database/models/account';
import { TProfile } from '#utils/database/models/profile';

type AuthUser = Partial<Omit<TAccount, 'profile'> & {
	role: 'admin' | 'kitchen' | 'customer'
	profile: Partial<TProfile>
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
