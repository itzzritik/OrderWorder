import { createContext, ReactNode, useState } from 'react';

import noop from 'lodash/noop';
import { toast } from 'react-toastify';
import useSWR from 'swr';

import { TOrder } from '#utils/database/models/order';
import { fetcher } from '#utils/helper/common';

const AdminOrderDefault: TAdminOrderInitialType = {
	orderRequest: [],
	orderActive: [],
	orderHistory: [],
	acceptOrder: () => new Promise(noop),
	acceptingOrder: false,
	rejectOrder: () => new Promise(noop),
	rejectingOrder: false,
};

export const AdminOrderContext = createContext(AdminOrderDefault);
export const AdminOrderProvider = ({ children }: TAdminOrderProviderProps) => {
	const { data: orderHistory = [], mutate } = useSWR('/api/adminOrder', fetcher);
	const [acceptingOrder, setAcceptingOrder] = useState(false);
	const [rejectingOrder, setRejectingOrder] = useState(false);

	const { orderRequest, orderActive } = orderHistory.reduce(
		(acc: { orderRequest: TOrder[], orderActive: TOrder[] }, order: TOrder) => {
			if (order.state === 'active') {
				acc.orderActive.push(order);
				if (order.products.some(({ adminApproved }) => !adminApproved)) acc.orderRequest.push(order);
			}
			return acc;
		},
		{ orderRequest: [], orderActive: [] },
	);

	const orderAction = async (accept: boolean) => {
		const req = await fetch('/api/adminOrder/action', { method: 'POST', body: JSON.stringify({
			action: accept ? 'accept' : 'reject',
		}) });
		const res = await req.json();

		if (!req.ok) toast.error(res?.message);
		await mutate();
	};
	const acceptOrder = async () => {
		setAcceptingOrder(true);
		orderAction(true);
		setAcceptingOrder(false);
	};
	const rejectOrder = async () => {
		setRejectingOrder(true);
		orderAction(false);
		setRejectingOrder(false);
	};

	console.log(orderRequest, orderActive);

	return (
		<AdminOrderContext.Provider value={{ orderRequest, orderActive, orderHistory, acceptOrder, acceptingOrder, rejectOrder, rejectingOrder }}>
			{children}
		</AdminOrderContext.Provider>
	);
};

export type TAdminOrderProviderProps = {
    children?: ReactNode
}

export type TAdminOrderInitialType = {
	orderRequest: TOrder[],
	orderActive: TOrder[],
	orderHistory: TOrder[],
	acceptOrder: () => Promise<void>,
	acceptingOrder: boolean,
	rejectOrder: () => Promise<void>,
	rejectingOrder: boolean,
}
