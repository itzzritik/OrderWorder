import mongoose from 'mongoose';

import { hashPassword, isBcryptHash } from '../manager';

const AccountSchema = new mongoose.Schema<TAccount>({
	username: { type: String, trim: true, lowercase: true, unique: true, required: true, sparse: true, index: { unique: true } },
	email: { type: String, trim: true, lowercase: true, unique: true, required: true, sparse: true, index: { unique: true } },
	password: { type: String, required: true },
	active: { type: Boolean, default: true },
},
{ timestamps: true });

AccountSchema.pre(['findOneAndUpdate'], async function (next) {
	const data = this.getUpdate() as TAccount;
	try {
		if (!isBcryptHash(data.password))
			this.setUpdate({ ...data, password: hashPassword(data.password) });

		next();
	} catch (error) {
		next(error);
	}
});

export const Account = mongoose.models?.account ?? mongoose.model<TAccount>('account', AccountSchema);
export type TAccount = Document & {
	username: string;
	email: string;
	password: string;
	active: boolean;
}

// const SESSION = mongoose.model('sessions', (() => {
// 	return new mongoose.Schema({
// 		'_id': String,
// 		'expires': Date,
// 		'session': Object,
// 	},
// 	{ '_id': false });
// })());

// const filter = [{
// 	$match: {
// 		$and: [{ operationType: 'delete' }],
// 	},
// }];
// const options = { fullDocument: 'updateLookup' };

// Account.watch(filter, options).on('change', async ({ documentKey: { _id: user } }) => {
// 	const sessions = await SESSION.find({ 'session.passport.user': user.toString() });
// 	await SESSION.deleteMany({ 'session.passport.user': user.toString() });

// 	// sessions.forEach(({ session: { appID } }) => {
// 	// 	endSession({}, appID);
// 	// });
// });
