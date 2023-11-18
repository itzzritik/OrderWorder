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
	rejectOrder: () => new Promise(noop),
	orderActionLoading: false,
};

export const AdminOrderContext = createContext(AdminOrderDefault);
export const AdminOrderProvider = ({ children }: TAdminOrderProviderProps) => {
	const { data: orderHistory = [], mutate } = useSWR('/api/adminOrder', fetcher);
	const [orderActionLoading, setOrderActionLoading] = useState(false);

	const { orderRequest, orderActive } = orderHistory?.reduce?.(
		(acc: { orderRequest: TOrder[], orderActive: TOrder[] }, order: TOrder) => {
			if (order.state === 'active') {
				acc.orderActive.push(order);
				if (order.products.some(({ adminApproved }) => !adminApproved)) acc.orderRequest.push(order);
			}
			return acc;
		},
		{ orderRequest: [], orderActive: [] },
	) ?? {};

	const orderAction = async (orderID: string, accept: boolean = true) => {
		const req = await fetch('/api/adminOrder/action', { method: 'POST', body: JSON.stringify({
			orderID,
			action: accept ? 'accept' : 'reject',
		}) });
		const res = await req.json();

		if (!req.ok) toast.error(res?.message);
		await mutate();
	};
	const acceptOrder = async (orderID: string) => {
		if (orderActionLoading) return;
		setOrderActionLoading(true);
		orderAction(orderID, true);
		setOrderActionLoading(false);
	};
	const rejectOrder = async (orderID: string) => {
		if (orderActionLoading) return;
		setOrderActionLoading(true);
		orderAction(orderID, false);
		setOrderActionLoading(false);
	};

	return (
		<AdminOrderContext.Provider value={{ orderRequest, orderActive, orderHistory, acceptOrder, rejectOrder, orderActionLoading }}>
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
	acceptOrder: (orderID: string) => Promise<void>,
	rejectOrder: (orderID: string) => Promise<void>,
	orderActionLoading: boolean,
}
