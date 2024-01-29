import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import connectDB from '#utils/database/connect';
import { Orders, TOrder } from '#utils/database/models/order';
import { authOptions } from '#utils/helper/authHelper';
import { CatchNextResponse } from '#utils/helper/common';

export async function POST () {
	try {
		const session = await getServerSession(authOptions);

		if (!session) throw { status: 401, message: 'Authentication Required' };

		await connectDB();

		const restaurantID = session?.restaurant?.username;
		const customer = session?.customer?._id;
		const order = await Orders.findOne<TOrder>({ restaurantID, customer, state: 'active' });

		if (!order) throw { status: 400, message: 'No active orders found' };

		order.state = 'cancel';

		await order.save();

		return NextResponse.json({ status: 200, message: 'Order canceled.' });
	} catch (err) {
		console.log(err);
		return CatchNextResponse(err);
	}
}

export const dynamic = "force-dynamic"