import mongoose from 'mongoose';

import { Accounts, TAccount } from './account';

const accountCache = new Map<string, TAccount | null>();

const TableSchema = new mongoose.Schema<TTable>({
	name: { type: String, trim: true, required: true },
	username: { type: String, trim: true, required: true },
	restaurantID: { type: String, trim: true, lowercase: true, required: true },
},
{ timestamps: true });

TableSchema.index({ username: 1, restaurantID: 1 }, { unique: true });

TableSchema.pre('save', async function (next) {
	try {
		let account = accountCache.get(this.restaurantID);
		if (!account) {
			account = await Accounts.findOne<TAccount>({ username: this.restaurantID });
			if (account) accountCache.set(this.restaurantID, account);
			else return next(new Error(`The associated account with username '${this.restaurantID}'does not exist.`));
		}

		next();
	} catch (error) {
		next(error);
	}
});
TableSchema.post('save', async function () {
	await Accounts.updateOne(
		{ username: this.restaurantID },
		{ $addToSet: { tables: this._id } },
	);
});

export const Tables = mongoose.models?.tables ?? mongoose.model<TTable>('tables', TableSchema);
export type TTable = {
	name: string;
	username: string;
	restaurantID: string;
}
