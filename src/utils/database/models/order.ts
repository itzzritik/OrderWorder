import mongoose from 'mongoose';

import { TCustomer } from './customer';
import { TMenu } from './menu';

const OrderSchema = new mongoose.Schema<TOrder>({
	restaurantID: { type: String, trim: true, lowercase: true, required: true },
	customer: { type: mongoose.Schema.Types.ObjectId, ref: 'customers' },
	active: { type: Boolean, default: true },
	canceled: { type: Boolean, default: false },
	orderTotal: { type: Number, default: 0 },
	tax: { type: Number, default: 0 },
	taxRate: { type: Number, default: 5 },
	products: [{
		product: { type: mongoose.Schema.Types.ObjectId, ref: 'menus' },
		quantity: { type: Number, default: 1 },
		adminApproved: { type: Boolean, default: false },
		fulfilled: { type: Boolean, default: false },
	}],
},
{ timestamps: true });

export const Orders = mongoose.models?.orders ?? mongoose.model<TOrder>('orders', OrderSchema);
export type TOrder = {
	restaurantID: string,
	customer: TCustomer,
	active: boolean,
	canceled: boolean,
	orderTotal: number,
	tax: number,
	taxRate: number,
	products: Array<TProduct>
}

export type TProduct = {
	product: TMenu,
	quantity: number,
	fulfilled: boolean,
	adminApproved: boolean,
}
