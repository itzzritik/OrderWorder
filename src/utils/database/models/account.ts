import { ObjectId } from 'mongodb';
import mongoose, { HydratedDocument } from 'mongoose';

import { hashPassword, isBcryptHash } from '../manager';

const AccountSchema = new mongoose.Schema<TAccount>({
	username: { type: String, trim: true, lowercase: true, unique: true, required: true, sparse: true, index: { unique: true } },
	email: { type: String, trim: true, lowercase: true, unique: true, required: true, sparse: true, index: { unique: true } },
	password: { type: String, required: true },
	accountActive: { type: Boolean, default: true },
	subscriptionActive: { type: Boolean, default: true },
	profile: { type: ObjectId, ref: 'profiles', unique: true },
	kitchens: [{ type: ObjectId, ref: 'kitchens', unique: true }],
	tables: [{ type: ObjectId, ref: 'tables', unique: true }],
	menus: [{ type: ObjectId, ref: 'menus', unique: true }],
},
{ timestamps: true });

AccountSchema.pre('findOneAndUpdate', async function (next) {
	const data = this.getUpdate() as TAccount;
	try {
		if (data.password && !isBcryptHash(data.password))
			this.setUpdate({ ...data, password: hashPassword(data.password) });

		next();
	} catch (error) {
		next(error);
	}
});

export const Accounts = mongoose.models?.accounts ?? mongoose.model<TAccount>('accounts', AccountSchema);
export type TAccount = HydratedDocument<{
	username: string;
	email: string;
	password: string;
	accountActive: boolean;
	subscriptionActive: boolean;
	profile: ObjectId;
	kitchens: Array<ObjectId>;
	tables: Array<ObjectId>;
	menus: Array<ObjectId>;
}>
