import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import connectDB from '#utils/database/connect';
import { Profiles } from '#utils/database/models/profile';
import { authOptions } from '#utils/helper/authHelper';
import { CatchNextResponse } from '#utils/helper/common';

export async function GET () {
	try {
		await connectDB();
		const session = await getServerSession(authOptions);
		if (!session) throw { status: 401, message: 'Authentication Required' };

		const profile = await Profiles.findOne({ restaurantID: session?.username });

		return NextResponse.json(profile);
	} catch (err) {
		console.log(err);
		return CatchNextResponse(err);
	}
}
