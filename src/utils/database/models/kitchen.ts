import mongoose from 'mongoose';

import { hashPassword } from '#utils/helper/passwordHelper';

import { Accounts, TAccount } from './account';

const KitchenSchema = new mongoose.Schema<TKitchen>({
	username: { type: String, trim: true, unique: true, required: true, sparse: true, index: { unique: true } },
	password: { type: String, required: true },
	restaurantID: { type: String, trim: true, lowercase: true, required: true },
},
{ timestamps: true });

KitchenSchema.pre('save', async function (next) {
	try {
		const account = await Accounts.findOne<TAccount>({ username: this.restaurantID });

		if (!account) return next(new Error(`The associated account with username '${this.restaurantID}'does not exist.`));
		if (this.isModified('password')) this.password = hashPassword(this.password);

		next();
	} catch (error) {
		next(error);
	}
});

KitchenSchema.post('save', async function () {
	const account = await Accounts.findOne<TAccount>({ username: this.restaurantID });
	if (!account) return new Error('The associated account does not exist.');
	account.kitchens.push(this._id as unknown as TKitchen);
	await account?.save();
});

export const Kitchens = mongoose.models?.kitchens ?? mongoose.model<TKitchen>('kitchens', KitchenSchema);
export type TKitchen = {
	username: string;
	password: string;
	restaurantID: string;
}
