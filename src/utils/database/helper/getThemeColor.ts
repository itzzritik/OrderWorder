import { getServerSession } from 'next-auth';

import { authOptions } from '#utils/helper/authHelper';

import { Profiles, TProfile } from '../models/profile';

export const getThemeColor = async (username?: string) => {
	if (!username) {
		const session = await getServerSession(authOptions);
		console.log(session);
		return session?.restaurant?.themeColor;
	}
	
	return (await Profiles.findOne<TProfile>({ restaurantID: username }))?.themeColor;
};
