import omit from 'lodash/omit';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import connectDB from '#utils/database/connect';
import { Accounts, TAccount } from '#utils/database/models/account';
import { Menus, TMenu } from '#utils/database/models/menu';
import { Profiles } from '#utils/database/models/profile';
import { TTable, Tables } from '#utils/database/models/table';
import { authOptions } from '#utils/helper/authHelper';
import { CatchNextResponse } from '#utils/helper/common';

export async function GET (req: Request) {
	try {
		let username = new URL(req.url).searchParams.get('id');

		if (!username) {
			const session = await getServerSession(authOptions);
			username = session?.username ?? null;
		}
		if (!username) throw { status: 400, message: 'Restaurant id is required to fetch menu' };

		await connectDB();
		const account = await Accounts.findOne<TAccount>({ username })
			.populate({ path: 'profile', model: Profiles })
			.populate({ path: 'tables', model: Tables })
			.populate({ path: 'menus', model: Menus })
			.lean();
		if (!account) throw { status: 404, message: `Account with restaurant id: ${username} is not found` };

		return NextResponse.json({
			...omit(account, ['__v', '_id', 'kitchens', 'password', 'profile', 'menus', 'tables']),
			profile: omit(account?.profile, ['__v', '_id']),
			menus: account?.menus.map((v: TMenu) => omit(v, ['__v'])),
			tables: account?.tables.map((v: TTable) => omit(v, ['__v', '_id'])),
		});
	}
	catch (err) {
		console.log(err);
		return CatchNextResponse(err);
	}
}

export const dynamic = "force-dynamic"