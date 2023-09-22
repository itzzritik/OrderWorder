import mongoose, { HydratedDocument } from 'mongoose';

import { checkIfExist } from '../manager';

import { Accounts } from './account';

const FoodType = ['spicy', 'extra-spicy', 'sweet'] as const;
const Veg = ['veg', 'non-veg', 'contains-egg'] as const;

const MenuSchema = new mongoose.Schema<TMenu>({
	name: { type: String, trim: true, unique: true, required: true, sparse: true, index: { unique: true } },
	restaurantID: { type: String, trim: true, lowercase: true, required: true },
	description: { type: String, trim: true },
	categories: [{ type: String, trim: true, lowercase: true }],
	price: { type: Number, trim: true, required: true },
	foodType: { type: String, trim: true, lowercase: true, enum: FoodType },
	veg: { type: String, trim: true, lowercase: true, required: true, enum: Veg },
	image: { type: String, trim: true },
},
{ timestamps: true });

MenuSchema.pre('findOneAndUpdate', async function (next) {
	const data = this.getUpdate() as TMenu;
	try {
		const account = await checkIfExist(Accounts, { username: data.restaurantID });
		if (!account) return next(new Error('Failed to Create Table, The associated account does not exist.'));

		this.setUpdate({ ...data, categories: Array.from(new Set(data.categories)) });

		next();
	} catch (error) {
		next(error);
	}
});
MenuSchema.post('findOneAndUpdate', async function (doc) {
	await Accounts.findOneAndUpdate({ username: doc.restaurantID }, { $push: { menus: doc._id } }, { new: true });
});

export const Menus = mongoose.models?.menus ?? mongoose.model<TMenu>('menus', MenuSchema);
export type TMenu = HydratedDocument<{
	name: string;
	restaurantID: string;
	description: string;
	categories: Array<string>;
	price: number;
	foodType: TFoodType;
	veg: TVeg;
	image: string;
}>

export type TFoodType = typeof FoodType[number];
export type TVeg = typeof Veg[number];
