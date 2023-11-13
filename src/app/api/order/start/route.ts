import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import connectDB from '#utils/database/connect';
import { Orders, TOrder, TProduct } from '#utils/database/models/order';
import { authOptions } from '#utils/helper/authHelper';
import { CatchNextResponse } from '#utils/helper/common';

export async function POST (req: Request) {
	try {
		const body = await req.json();
		const session = await getServerSession(authOptions);

		if (!session) throw { status: 401, message: 'Authentication Required' };
		if (!body?.products.length) throw { status: 400, message: 'Can\'t initiate new order on empty cart' };

		const products: TProduct[] = body?.products?.map((product: TProduct & {_id: string}) => ({
			product: product?._id,
			quantity: product?.quantity,
		}));

		await connectDB();

		const restaurantID = session?.restaurant?.username;
		const customer = session?.customer?._id;
		const order = await Orders.findOne<TOrder>({ restaurantID, customer, active: true }).lean();

		if (order) throw { status: 400, message: 'Can\'t initiate a new order, while one is in progress' };

		await Orders.create<TOrder>({ restaurantID, customer, products: products });

		return NextResponse.json({ status: 200, message: 'Order placed successfully' });
	} catch (err) {
		console.log(err);
		return CatchNextResponse(err);
	}
}
