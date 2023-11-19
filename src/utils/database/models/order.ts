import mongoose, { HydratedDocument } from 'mongoose';

import { TCustomer } from './customer';
import { TMenu } from './menu';

const orderState = ['active', 'reject', 'cancel', 'complete'] as const;
const OrderSchema = new mongoose.Schema<TOrder>({
	restaurantID: { type: String, trim: true, lowercase: true, required: true },
	table: { type: String, trim: true, lowercase: true, required: true },
	customer: { type: mongoose.Schema.Types.ObjectId, ref: 'customers' },
	state: { type: String, trim: true, lowercase: true, enum: orderState, default: 'active' },
	orderTotal: { type: Number },
	taxTotal: { type: Number },
	products: [{
		product: { type: mongoose.Schema.Types.ObjectId, ref: 'menus' },
		quantity: { type: Number, default: 1 },
		price: { type: Number, required: true },
		tax: { type: Number, required: true },
		adminApproved: { type: Boolean, default: false },
		fulfilled: { type: Boolean, default: false },
	}],
},
{ timestamps: true });

OrderSchema.pre('save', function (next) {
	try {
		this.orderTotal = 0;
		this.taxTotal = 0;
		this?.products?.forEach(({ quantity, price, tax }) => {
			this.orderTotal += (price * quantity);
			this.taxTotal += tax;
		});
		next();
	} catch (error) {
		next(error);
	}
});

export const Orders = mongoose.models?.orders ?? mongoose.model<TOrder>('orders', OrderSchema);
export type TOrder = HydratedDocument<{
	restaurantID: string,
	table: string,
	customer: TCustomer,
	state: typeof orderState[number],
	orderTotal: number,
	taxTotal: number,
	products: Array<TProduct>
}>

export type TProduct = TMenu & {
	_id: mongoose.Types.ObjectId,
	product: TMenu,
	quantity: number,
	price: number,
	tax: number,
	fulfilled: boolean,
	adminApproved: boolean,
}
