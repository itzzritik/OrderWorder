import mongoose, { HydratedDocument } from 'mongoose';

import { Accounts, TAccount } from './account';

const ProfileSchema = new mongoose.Schema<TProfile>({
	name: { type: String, trim: true, required: true },
	restaurantID: { type: String, trim: true, lowercase: true, unique: true, required: true, sparse: true, index: { unique: true } },
	description: { type: String, trim: true },
	address: { type: String, trim: true },
	themeColor: {
		r: { type: Number, trim: true, min: 0, max: 255 },
		g: { type: Number, trim: true, min: 0, max: 255 },
		b: { type: Number, trim: true, min: 0, max: 255 },
	},
	gstInclusive: { type: Boolean, default: false },
	categories: [{ type: String, trim: true, lowercase: true, match: /^[^,]*$/ }],
	avatar: { type: String, trim: true },
	cover: { type: String, trim: true },
	photos: [{ type: String, trim: true }],
},
{ timestamps: true });

ProfileSchema.pre('save', async function (next) {
	try {
		const account = await Accounts.findOne<TAccount>({ username: this.restaurantID });

		if (!account) return next(new Error(`The associated account with username '${this.restaurantID}'does not exist.`));

		this.categories = Array.from(new Set(this.categories));

		next();
	} catch (error) {
		next(error);
	}
});
ProfileSchema.post('save', async function () {
	const account = await Accounts.findOne<TAccount>({ username: this.restaurantID });

	if (!account) return new Error('The associated account does not exist.');

	account.profile = this._id as unknown as TProfile;
	await account?.save();
});

export const Profiles = mongoose.models?.profiles ?? mongoose.model<TProfile>('profiles', ProfileSchema);
export type TProfile = HydratedDocument<{
	name: string;
	restaurantID: string;
	description: string;
	address: string;
	avatar: string;
	cover: string;
	photos: Array<string>;
	themeColor: TThemeColor;
	gstInclusive: boolean;
	categories: Array<string>;
}>
export type TThemeColor = {
	r: number;
	g: number;
	b: number;
}
