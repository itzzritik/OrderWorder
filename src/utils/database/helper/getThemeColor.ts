import { getServerSession } from "next-auth";

import { authOptions } from "#utils/helper/authHelper";
import connectDB from "../connect";
import { Profiles, type TProfile } from "../models/profile";

export const getThemeColor = async (username?: string) => {
	if (!username) {
		const session = await getServerSession(authOptions);
		return session?.themeColor;
	}

	await connectDB();
	const themeColor = (await Profiles.findOne<TProfile>({ restaurantID: username }))?.themeColor;
	return themeColor;
};
