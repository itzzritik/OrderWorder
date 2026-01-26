import connectDB from "#utils/database/connect";
import { Accounts, type TAccount } from "#utils/database/models/account";

export async function getRestaurantData(username: string) {
	await connectDB();
	return await Accounts.findOne<TAccount>({ username }).populate("profile").populate("tables").populate("menus").lean();
}
