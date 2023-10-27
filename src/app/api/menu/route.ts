import omit from 'lodash/omit';
import { NextResponse } from 'next/server';

import connectDB from '#utils/database/connect';
import { Accounts, TAccount } from '#utils/database/models/account';
import { Menus, TMenu } from '#utils/database/models/menu';
import { Profiles } from '#utils/database/models/profile';
import { TTable, Tables } from '#utils/database/models/table';
import { CatchNextResponse } from '#utils/helper/common';

export async function GET (req: Request) {
	try {
		const username = new URL(req.url).searchParams.get('id');
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
