import mongoose from 'mongoose';

import { checkIfExist } from '../manager';

import { Account } from './account';

const TableSchema = new mongoose.Schema<TTable>({
	name: { type: String, trim: true, required: true },
	username: { type: String, trim: true, unique: true, required: true, sparse: true, index: { unique: true } },
	restaurantID: { type: String, trim: true, lowercase: true, required: true },
},
{ timestamps: true });

TableSchema.pre(['findOneAndUpdate'], async function (next) {
	const data = this.getUpdate() as TTable;
	try {
		const account = await checkIfExist(Account, { username: data.restaurantID });
		if (!account) return next(new Error('Failed to Create Table, The associated account does not exist.'));
		next();
	} catch (error) {
		next(error);
	}
});

export const Table = mongoose.models?.table ?? mongoose.model<TTable>('table', TableSchema);
export type TTable = Document & {
	name: string;
	username: string;
	restaurantID: string;
}
