import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import connectDB from '#utils/database/connect';
import { Customers } from '#utils/database/models/customer';
import { Menus } from '#utils/database/models/menu';
import { Orders, TOrder } from '#utils/database/models/order';
import { authOptions } from '#utils/helper/authHelper';
import { CatchNextResponse } from '#utils/helper/common';

export async function GET () {
	try {
		await connectDB();
		const session = await getServerSession(authOptions);
		if (!session) throw { status: 401, message: 'Authentication Required' };

		const restaurantID = session?.username;
		const orders: TOrder[] = (await Orders.find<TOrder>({ restaurantID })
			.populate({ path: 'customer', model: Customers })
			.populate({ path: 'products.product', model: Menus }).lean()) ?? [];

		orders?.forEach?.((order) => {
			if (order?.products)
				order.products = order?.products?.map((product) => {
					product = { ...product, ...product.product };
					product.product = product?.product?.id;
					return product;
				});
		});

		return NextResponse.json(orders);
	} catch (err) {
		console.log(err);
		return CatchNextResponse(err);
	}
}

export const dynamic = "force-dynamic"