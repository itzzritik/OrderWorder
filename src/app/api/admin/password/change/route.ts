import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import connectDB from '#utils/database/connect';
import { Accounts, TAccount } from '#utils/database/models/account';
import { authOptions } from '#utils/helper/authHelper';
import { CatchNextResponse } from '#utils/helper/common';
import { verifyPassword } from '#utils/helper/passwordHelper';

export async function POST (req: Request) {
	try {
		console.time('connectDB');
		await connectDB();
		console.timeEnd('connectDB');
		console.time('getSession');
		const session = await getServerSession(authOptions);
		console.timeEnd('getSession');
		const { password, newPassword } = await req.json();

		if (!session) throw { status: 401, message: 'Authentication Required' };
		if (!password) throw { status: 400, message: 'Password Required' };
		if (!newPassword) throw { status: 400, message: 'New Password Required' };

		console.time('findAccount');
		const account = await Accounts.findOne<TAccount>({ username: session?.username });
		console.timeEnd('findAccount');

		if (!account) throw { status: 500, message: 'Something went wrong' };

		console.time('verifyPassword');
		const valid = verifyPassword(password, account.password);
		console.timeEnd('verifyPassword');

		if (valid) {
			account.password = newPassword;
			console.time('saveAccount');
			await account.save();
			console.timeEnd('saveAccount');
			return NextResponse.json({ status: 200, message: 'Password successfully changed' });
		}

		return NextResponse.json({ status: 403, message: 'Password incorrect' });
	} catch (err) {
		console.log(err);
		return CatchNextResponse(err);
	}
}

export const dynamic = 'force-dynamic';
