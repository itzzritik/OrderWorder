import mongoose, { HydratedDocument } from 'mongoose';

import { hashPassword } from '#utils/helper/passwordHelper';

const AccountSchema = new mongoose.Schema<TAccount>({
	username: { type: String, trim: true, lowercase: true, unique: true, required: true, sparse: true, index: { unique: true } },
	email: { type: String, trim: true, lowercase: true, unique: true, required: true, sparse: true, index: { unique: true } },
	password: { type: String, required: true },
	verified: { type: Boolean, default: false },
	accountActive: { type: Boolean, default: true },
	subscriptionActive: { type: Boolean, default: true },
	profile: { type: mongoose.Types.ObjectId, ref: 'profiles', unique: true },
	kitchens: [{ type: mongoose.Types.ObjectId, ref: 'kitchens', unique: true }],
	tables: [{ type: mongoose.Types.ObjectId, ref: 'tables', unique: true }],
	menus: [{ type: mongoose.Types.ObjectId, ref: 'menus', unique: true }],
},
{ timestamps: true });

AccountSchema.pre('findOneAndUpdate', async function (next) {
	const data = this.getUpdate() as TAccount;
	try {
		if (data.password)
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
	verified: boolean;
	accountActive: boolean;
	subscriptionActive: boolean;
	profile: mongoose.Types.ObjectId;
	kitchens: Array<mongoose.Types.ObjectId>;
	tables: Array<mongoose.Types.ObjectId>;
	menus: Array<mongoose.Types.ObjectId>;
}>
