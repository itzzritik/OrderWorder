import 'next-auth';

import { TAccount } from '#utils/database/models/account';
import { TProfile } from '#utils/database/models/profile';

type AuthUser = Partial<Omit<TAccount, 'profile'> & { profile: Partial<TProfile> }>

declare module 'next-auth' {
	interface User {
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
