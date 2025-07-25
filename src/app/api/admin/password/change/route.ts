import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import connectDB from '#utils/database/connect';
import { Accounts, TAccount } from '#utils/database/models/account';
import { authOptions } from '#utils/helper/authHelper';
import { CatchNextResponse } from '#utils/helper/common';
import { verifyPassword } from '#utils/helper/passwordHelper';

export async function POST (req: Request) {
	try {
		await connectDB();
		const session = await getServerSession(authOptions);
		const { password, newPassword } = await req.json();

		if (!session) throw { status: 401, message: 'Authentication Required' };
		if (!password) throw { status: 400, message: 'Password Required' };
		if (!newPassword) throw { status: 400, message: 'New Password Required' };

		const account = await Accounts.findOne<TAccount>({ username: session?.username });

		if (!account) throw { status: 500, message: 'Something went wrong' };

		const valid = await verifyPassword(password, account.password);

		if (valid) {
			account.password = newPassword;
			await account.save();
			return NextResponse.json({ status: 200, message: 'Password successfully changed' });
		}

		return NextResponse.json({ status: 403, message: 'Password incorrect' });
	} catch (err) {
		console.log(err);
		return CatchNextResponse(err);
	}
}

export const dynamic = 'force-dynamic';
