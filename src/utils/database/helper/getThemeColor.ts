import { getServerSession } from 'next-auth';

import { authOptions } from '#utils/helper/authHelper';

import { Profiles, TProfile } from '../models/profile';
import connectDB from '../connect';

export const getThemeColor = async (username?: string) => {
	if (!username) {
		const session = await getServerSession(authOptions);
		return session?.themeColor;
	}
	
	await connectDB();
	const themeColor = (await Profiles.findOne<TProfile>({ restaurantID: username }))?.themeColor;
	return themeColor;
};
