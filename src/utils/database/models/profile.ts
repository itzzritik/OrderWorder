import mongoose, { HydratedDocument } from 'mongoose';

import { checkIfExist } from '../manager';

import { Accounts } from './account';

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
	gstInclusive: { type: Boolean, default: false },
	categories: [{ type: String, trim: true, lowercase: true }],
	avatar: { type: String, trim: true },
},
{ timestamps: true });

ProfileSchema.pre('findOneAndUpdate', async function (next) {
	const data = this.getUpdate() as TProfile;
	try {
		const account = await checkIfExist(Accounts, { username: data.restaurantID });
		if (!account) return next(new Error(`Failed to Create Profile, The associated account with username '${data.restaurantID}'does not exist.`));

		this.setUpdate({ ...data, categories: Array.from(new Set(data.categories)) });

		next();
	} catch (error) {
		next(error);
	}
});
ProfileSchema.post('findOneAndUpdate', async function (doc) {
	await Accounts.findOneAndUpdate({ username: doc.restaurantID }, { profile: doc._id }, { new: true });
});

export const Profiles = mongoose.models?.profiles ?? mongoose.model<TProfile>('profiles', ProfileSchema);
export type TProfile = HydratedDocument<{
	name: string;
	restaurantID: string;
	description: string;
	address: string;
	avatar: string;
	themeColor: {
		red: number;
		green: number;
		blue: number;
	};
	gstInclusive: boolean;
	categories: Array<string>;
}>
