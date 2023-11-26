import mongoose, { HydratedDocument } from 'mongoose';

import { hashPassword } from '#utils/helper/passwordHelper';

import { TKitchen } from './kitchen';
import { TMenu } from './menu';
import { TProfile } from './profile';
import { TTable } from './table';

const AccountSchema = new mongoose.Schema<TAccount>({
	username: { type: String, trim: true, lowercase: true, unique: true, required: true, sparse: true, index: { unique: true } },
	email: { type: String, trim: true, lowercase: true, unique: true, required: true, sparse: true, index: { unique: true } },
	password: { type: String, required: true },
	verified: { type: Boolean, default: false },
	accountActive: { type: Boolean, default: true },
	subscriptionActive: { type: Boolean, default: true },
	profile: { type: mongoose.Schema.Types.ObjectId, ref: 'profiles', unique: true },
	kitchens: [{ type: mongoose.Schema.Types.ObjectId, ref: 'kitchens', unique: true }],
	tables: [{ type: mongoose.Schema.Types.ObjectId, ref: 'tables', unique: true }],
	menus: [{ type: mongoose.Schema.Types.ObjectId, ref: 'menus', unique: true }],
},
{ timestamps: true });

AccountSchema.pre('save', async function (next) {
	try {
		if (this.isModified('password')) this.password = hashPassword(this?.password);

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
	profile: TProfile;
	kitchens: Array<TKitchen>;
	tables: Array<TTable>;
	menus: Array<TMenu>;
}>
