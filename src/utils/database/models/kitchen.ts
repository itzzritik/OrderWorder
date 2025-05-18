import mongoose from 'mongoose';

import { hashPassword } from '#utils/helper/passwordHelper';

import { Accounts, TAccount } from './account';

const accountCache = new Map<string, TAccount | null>();

const KitchenSchema = new mongoose.Schema<TKitchen>({
	username: { type: String, trim: true, unique: true, required: true, sparse: true, index: { unique: true } },
	password: { type: String, required: true },
	restaurantID: { type: String, trim: true, lowercase: true, required: true },
},
{ timestamps: true });

KitchenSchema.pre('save', async function (next) {
	try {
		let account = accountCache.get(this.restaurantID);
		if (!account) {
			account = await Accounts.findOne<TAccount>({ username: this.restaurantID });
			if (account) accountCache.set(this.restaurantID, account);
			else return next(new Error(`The associated account with username '${this.restaurantID}'does not exist.`));
		}

		if (this.isModified('password')) this.password = await hashPassword(this.password);
		next();
	} catch (error) {
		next(error);
	}
});

KitchenSchema.post('save', async function () {
	await Accounts.updateOne(
		{ username: this.restaurantID },
		{ $addToSet: { kitchens: this._id } },
	);
});

export const Kitchens = mongoose.models?.kitchens ?? mongoose.model<TKitchen>('kitchens', KitchenSchema);
export type TKitchen = {
	username: string;
	password: string;
	restaurantID: string;
}
