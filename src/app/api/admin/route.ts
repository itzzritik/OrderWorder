import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import connectDB from '#utils/database/connect';
import { Accounts, TAccount } from '#utils/database/models/account';
import { Menus } from '#utils/database/models/menu';
import { Profiles } from '#utils/database/models/profile';
import { Tables } from '#utils/database/models/table';
import { authOptions } from '#utils/helper/authHelper';
import { CatchNextResponse } from '#utils/helper/common';

export async function GET () {
	try {
		await connectDB();
		const session = await getServerSession(authOptions);
		if (!session) throw { status: 401, message: 'Authentication Required' };

		const account = await Accounts.findOne<TAccount>({ username: session?.username })
			.populate({ path: 'profile', model: Profiles })
			.populate({ path: 'tables', model: Tables })
			.populate({ path: 'menus', model: Menus })
			.lean();

		if (!account) throw { status: 500, message: 'Unable to fetch data' };

		return NextResponse.json({
			profile: account.profile,
			menus: account.menus,
			tables: account.tables,
		});
	} catch (err) {
		console.log(err);
		return CatchNextResponse(err);
	}
}

export const dynamic = "force-dynamic"