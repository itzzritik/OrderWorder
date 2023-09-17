import mongoose from 'mongoose';

import { checkIfExist, hashPassword, isBcryptHash } from '../manager';

import { Accounts } from './account';

const KitchenSchema = new mongoose.Schema<TKitchen>({
	username: { type: String, trim: true, unique: true, required: true, sparse: true, index: { unique: true } },
	password: { type: String, required: true },
	restaurantID: { type: String, trim: true, lowercase: true, required: true },
},
{ timestamps: true });

KitchenSchema.pre('findOneAndUpdate', async function (next) {
	const data = this.getUpdate() as TKitchen;
	try {
		const account = await checkIfExist(Accounts, { username: data.restaurantID });
		if (!account) return next(new Error(`Failed to Create Kitchen, The associated account with username '${data.restaurantID}'does not exist.`));

		if (data.password && !isBcryptHash(data.password))
			this.setUpdate({ ...data, password: hashPassword(data.password) });

		next();
	} catch (error) {
		next(error);
	}
});
KitchenSchema.post('findOneAndUpdate', async function (doc) {
	await Accounts.findOneAndUpdate({ username: doc.restaurantID }, { $push: { kitchens: doc._id } }, { new: true });
});

export const Kitchens = mongoose.models?.kitchens ?? mongoose.model<TKitchen>('kitchens', KitchenSchema);
export type TKitchen = Document & {
	username: string;
	password: string;
	restaurantID: string;
}
