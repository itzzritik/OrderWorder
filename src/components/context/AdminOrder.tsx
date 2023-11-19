import { createContext, ReactNode, useEffect, useState } from 'react';

import noop from 'lodash/noop';
import { useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import useSWR from 'swr';

import { TOrder } from '#utils/database/models/order';
import { fetcher } from '#utils/helper/common';

const AdminOrderDefault: TAdminOrderInitialType = {
	orderRequest: [],
	orderActive: [],
	orderHistory: [],
	orderAction: () => new Promise(noop),
	orderActionLoading: false,
	orderLoading: false,
};

export const AdminOrderContext = createContext(AdminOrderDefault);
export const AdminOrderProvider = ({ children }: TAdminOrderProviderProps) => {
	const params = useSearchParams();
	const tab = params.get('tab');
	const subTab = params.get('subTab');
	const { data: orderData = [], isLoading: orderLoading, mutate } = useSWR('/api/adminOrder', fetcher);
	const [orderActionLoading, setOrderActionLoading] = useState(false);
	console.log(orderLoading);
	const { orderRequest, orderActive, orderHistory } = orderData?.reduce?.(
		(acc: { orderRequest: TOrder[], orderActive: TOrder[], orderHistory: TOrder[] }, order: TOrder) => {
			if (order.state === 'active') {
				if (order.products.some(({ adminApproved }) => adminApproved)) acc.orderActive.push(order);
				if (order.products.some(({ adminApproved }) => !adminApproved)) acc.orderRequest.push(order);
			}
			else acc.orderHistory.push(order);
			return acc;
		},
		{ orderRequest: [], orderActive: [], orderHistory: [] },
	) ?? {};

	const orderAction = async (orderID: string, action: 'accept' | 'complete' | 'reject') => {
		if (orderActionLoading) return;
		setOrderActionLoading(true);
		const req = await fetch('/api/adminOrder/action', { method: 'POST', body: JSON.stringify({ orderID, action }) });
		const res = await req.json();

		if (!req.ok) toast.error(res?.message);
		await mutate();
		setOrderActionLoading(false);
	};

	useEffect(() => {
		mutate();
	}, [tab, subTab, mutate]);

	return (
		<AdminOrderContext.Provider value={{ orderRequest, orderActive, orderHistory, orderAction, orderActionLoading, orderLoading }}>
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
	orderAction: (orderID: string, action: TOrderAction) => Promise<void>,
	orderActionLoading: boolean,
	orderLoading: boolean,
}

export type TOrderAction = 'accept' | 'complete' | 'reject'
