import pick from 'lodash/pick';
import { NextResponse } from 'next/server';

import connectDB from '#utils/database/connect';
import { Accounts, TAccount } from '#utils/database/models/account';
import { Profiles } from '#utils/database/models/profile';
import { CatchNextResponse } from '#utils/helper/common';

export async function GET (req: Request) {
	try {
		const email = new URL(req.url).searchParams.get('email');
		await connectDB();
		const account = await Accounts.findOne<TAccount>({ email }).populate({ path: 'profile', model: Profiles });
		if (!account) throw { status: 404, message: 'Account not found' };

		return NextResponse.json(pick(account?.profile, ['name', 'address', 'themeColor', 'avatar']));
	}
	catch (err) {
		console.log(err);
		return CatchNextResponse(err);
	}
}

export const dynamic = "force-dynamic"