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
		if (!account) throw `Failed to Create Kitchen, The associated account with username '${data.restaurantID}'does not exist.`;

		if (data.password) {
			if (isBcryptHash(data.password)) throw 'Hashed password cannot be hashed again';
			if (data.password.length < 6) throw 'Password must be at least 6 characters long';

			this.setUpdate({ ...data, password: hashPassword(data.password) });
		}

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
