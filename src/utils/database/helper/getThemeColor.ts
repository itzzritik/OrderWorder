import { getServerSession } from 'next-auth';

import { authOptions } from '#utils/helper/authHelper';

import { Profiles, TProfile } from '../models/profile';
import { TThemeColor } from 'xtreme-ui';

global.themeColors = new Map<string, TThemeColor | null>();

export const getThemeColor = async (username?: string) => {
	if (!username) {
		const session = await getServerSession(authOptions);
		return session?.themeColor;
	}

	let themeColor = global.themeColors.get(username);
	if (!themeColor) {
		themeColor = (await Profiles.findOne<TProfile>({ restaurantID: username }))?.themeColor;
		if (themeColor) global.themeColors.set(username, themeColor);
		console.log('themeColors', username, themeColor);
	}
	return themeColor;
};
