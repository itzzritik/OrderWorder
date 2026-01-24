import "next-auth";

import type { TAccount } from "#utils/database/models/account";
import type { TCustomer } from "#utils/database/models/customer";
import type { TProfile } from "#utils/database/models/profile";
import type { TTable } from "#utils/database/models/table";

type AuthUser = Partial<
	Omit<TAccount, "profile"> & {
		role: "admin" | "kitchen" | "customer";
		customer: Partial<TCustomer>;
		themeColor: TProfile.themeColor;
		restaurant: Partial<{
			username: TProfile.username;
			table: TTable.username;
			name: TProfile.name;
			avatar: TProfile.avatar;
		}>;
	}
>;

declare module "next-auth" {
	interface User {
		role: "admin" | "kitchen" | "customer";
		themeColor: TProfile.themeColor;
		_doc: AuthUser;
	}

	interface Session extends AuthUser {
		expires: string;
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		user: AuthUser;
	}
}
