import mongoose, { HydratedDocument } from 'mongoose';

import { Accounts, TAccount } from './account';
import { Profiles } from './profile';

const accountCache = new Map<string, TAccount | null>();

const FoodType = ['spicy', 'extra-spicy', 'sweet'] as const;
const Veg = ['veg', 'non-veg', 'contains-egg'] as const;

const MenuSchema = new mongoose.Schema<TMenu>({
	name: { type: String, trim: true, unique: true, required: true, sparse: true, index: { unique: true } },
	restaurantID: { type: String, trim: true, lowercase: true, required: true },
	description: { type: String, trim: true },
	category: { type: String, trim: true, lowercase: true },
	price: { type: Number, trim: true, required: true },
	taxPercent: { type: Number, trim: true, required: true },
	foodType: { type: String, trim: true, lowercase: true, enum: FoodType },
	veg: { type: String, trim: true, lowercase: true, required: true, enum: Veg },
	image: { type: String, trim: true },
	hidden: { type: Boolean, default: true },
},
{ timestamps: true });

MenuSchema.pre('save', async function (next) {
	try {
		let account = accountCache.get(this.restaurantID);
		if (!account) {
			account = await Accounts.findOne<TAccount>({ username: this.restaurantID }).populate('profile')
			if (account) accountCache.set(this.restaurantID, account);
			else return next(new Error(`The associated account with username '${this.restaurantID}'does not exist.`));
		}
		if (!account?.profile?.categories?.includes(this.category))
			return next(new Error('The menu item category does not exist.'));

		next();
	} catch (error) {
		next(error);
	}
});
MenuSchema.post('save', async function () {
	await Accounts.updateOne(
		{ username: this.restaurantID },
		{ $addToSet: { menus: this._id } },
	);
});

export const Menus = mongoose.models?.menus ?? mongoose.model<TMenu>('menus', MenuSchema);
export type TMenu = HydratedDocument<{
	name: string;
	restaurantID: string;
	description: string;
	category: string;
	price: number;
	taxPercent: number;
	foodType: TFoodType;
	veg: TVeg;
	image: string;
	hidden: boolean;
}>

export type TFoodType = typeof FoodType[number];
export type TVeg = typeof Veg[number];
