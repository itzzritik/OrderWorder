import { ObjectId } from 'mongodb';
import mongoose, { HydratedDocument } from 'mongoose';

import { hashPassword, isBcryptHash } from '../manager';

const AccountSchema = new mongoose.Schema<TAccount>({
	username: { type: String, trim: true, lowercase: true, unique: true, required: true, sparse: true, index: { unique: true } },
	email: { type: String, trim: true, lowercase: true, unique: true, required: true, sparse: true, index: { unique: true } },
	password: { type: String, required: true },
	verified: { type: Boolean, default: false },
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

export const Accounts = mongoose.models?.accounts ?? mongoose.model<TAccount>('accounts', AccountSchema);
export type TAccount = HydratedDocument<{
	username: string;
	email: string;
	password: string;
	verified: boolean;
	accountActive: boolean;
	subscriptionActive: boolean;
	profile: ObjectId;
	kitchens: Array<ObjectId>;
	tables: Array<ObjectId>;
	menus: Array<ObjectId>;
}>
