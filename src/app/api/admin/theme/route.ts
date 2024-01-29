import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import connectDB from '#utils/database/connect';
import { Profiles, TProfile } from '#utils/database/models/profile';
import { authOptions } from '#utils/helper/authHelper';
import { CatchNextResponse, isValidRGB } from '#utils/helper/common';

export async function POST (req: Request) {
	try {
		await connectDB();
		const session = await getServerSession(authOptions);
		const { themeColor } = await req.json();

		if (!session) throw { status: 401, message: 'Authentication Required' };
		if (!isValidRGB(themeColor)) throw { status: 400, message: 'Valid theme color is required' };

		const profile = await Profiles.findOne<TProfile>({ restaurantID: session?.username });

		if (!profile) throw { status: 500, message: 'Something went wrong' };

		profile.themeColor = themeColor;
		await profile.save();

		return NextResponse.json({ status: 200, message: 'Theme applied successfully' });
	} catch (err) {
		console.log(err);
		return CatchNextResponse(err);
	}
}

export const dynamic = "force-dynamic"