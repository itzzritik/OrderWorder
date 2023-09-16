import mongoose from 'mongoose';

import { checkIfExist } from '../manager';

import { Account } from './account';

const ProfileSchema = new mongoose.Schema<TProfile>({
	name: { type: String, trim: true, required: true },
	restaurantID: { type: String, trim: true, lowercase: true, unique: true, required: true, sparse: true, index: { unique: true } },
	description: { type: String, trim: true },
	address: { type: String, trim: true },
	themeColor: {
		red: { type: Number, trim: true, min: 0, max: 255 },
		green: { type: Number, trim: true, min: 0, max: 255 },
		blue: { type: Number, trim: true, min: 0, max: 255 },
	},
	subscriptionActive: { type: Boolean, default: true },
	gstInclusive: { type: Boolean, default: false },
	categories: [{ type: String, trim: true, lowercase: true }],
},
{ timestamps: true });

ProfileSchema.pre(['findOneAndUpdate'], async function (next) {
	const data = this.getUpdate() as TProfile;
	try {
		const account = await checkIfExist(Account, { username: data.restaurantID });
		if (!account) return next(new Error(`Failed to Create Profile, The associated account with username '${data.restaurantID}'does not exist.`));

		this.setUpdate({ ...data, categories: Array.from(new Set(data.categories)) });

		next();
	} catch (error) {
		next(error);
	}
});

export const Profile = mongoose.models?.profile ?? mongoose.model<TProfile>('profile', ProfileSchema);
export type TProfile = Document & {
	name: string;
	restaurantID: string;
	description: string;
	address: string;
	themeColor: {
		red: number;
		green: number;
		blue: number;
	};
	subscriptionActive: boolean;
	gstInclusive: boolean;
	categories: Array<string>;
}
