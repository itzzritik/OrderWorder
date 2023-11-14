import mongoose from 'mongoose';

import { TCustomer } from './customer';
import { TMenu } from './menu';

const orderState = ['active', 'cancel', 'complete'] as const;
const OrderSchema = new mongoose.Schema<TOrder>({
	restaurantID: { type: String, trim: true, lowercase: true, required: true },
	customer: { type: mongoose.Schema.Types.ObjectId, ref: 'customers' },
	state: { type: String, trim: true, lowercase: true, enum: orderState, default: 'active' },
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
	state: typeof orderState[number],
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
