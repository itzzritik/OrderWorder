import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import connectDB from '#utils/database/connect';
import { Orders, TOrder } from '#utils/database/models/order';
import { authOptions } from '#utils/helper/authHelper';
import { CatchNextResponse } from '#utils/helper/common';

const actions = ['accept', 'reject'];
export async function POST (req: Request) {
	try {
		const session = await getServerSession(authOptions);
		const body = await req.json();

		if (!session) throw { status: 401, message: 'Authentication Required' };
		if (!body?.orderID) throw { status: 400, message: 'Order id is required to perform an action' };
		if (!actions.includes(body?.action)) throw { status: 400, message: 'Invalid action provided' };

		await connectDB();

		const order = await Orders.findById<TOrder>(body?.orderID);

		if (!order) throw { status: 400, message: `Order with id: ${body?.orderID} not found` };

		if (body.action == 'accept')
			order.products.forEach((product) => {
				product.adminApproved = true;
			});

		if (body.action == 'reject')
			order.state = 'reject';

		await order.save();

		return NextResponse.json({ status: 200, message: 'Order placed successfully' });
	} catch (err) {
		console.log(err);
		return CatchNextResponse(err);
	}
}
