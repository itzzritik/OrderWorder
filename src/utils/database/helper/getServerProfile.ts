import { authOptions } from "#utils/helper/authHelper";
import { getServerSession } from "next-auth";
import { Profiles, TProfile } from "../models/profile";

export const getServerProfile = async (username?: string) => {
	if (!username) username = (await getServerSession(authOptions))?.username;
	return await Profiles.findOne<TProfile>({ restaurantID: username });
}