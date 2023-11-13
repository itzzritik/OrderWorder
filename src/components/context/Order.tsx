import { createContext, ReactNode, useState } from 'react';

import noop from 'lodash/noop';
import pick from 'lodash/pick';
import { toast } from 'react-toastify';
import useSWR from 'swr';

import { TMenu } from '#utils/database/models/menu';
import { TOrder } from '#utils/database/models/order';
import { fetcher } from '#utils/helper/common';

const OrderDefault: TOrderInitialType = {
	order: undefined,
	startOrder: () => new Promise(noop),
	startingOrder: false,
	cancelOrder: noop,
	cancelingOrder: false,
};

export const OrderContext = createContext(OrderDefault);
export const OrderProvider = ({ children }: TOrderProviderProps) => {
	const { data: order, mutate } = useSWR('/api/order', fetcher);
	console.log(order);

	const [startingOrder, setStartingOrder] = useState(false);
	const [cancelingOrder, setCancelingOrder] = useState(false);

	const startOrder = async (products: Array<TMenuCustom>) => {
		setStartingOrder(true);
		const req = await fetch('/api/order/start', { method: 'POST', body: JSON.stringify({
			products: products.map((product) => pick(product, ['_id', 'quantity'])),
		}) });
		const res = await req.json();

		if (!req.ok) toast.error(res?.message);
		await mutate();
		setStartingOrder(false);
	};
	const cancelOrder = async () => {
		setCancelingOrder(true);
		const req = await fetch('/api/order/cancel', { method: 'POST' });
		const res = await req.json();

		if (!req.ok) toast.error(res?.message);
		await mutate();
		setCancelingOrder(false);
	};

	return (
		<OrderContext.Provider value={{ order, startOrder, startingOrder, cancelOrder, cancelingOrder }}>
			{children}
		</OrderContext.Provider>
	);
};

export type TOrderProviderProps = {
    children?: ReactNode
}

export type TOrderInitialType = {
	order?: TOrder,
	startOrder: (products: Array<TMenuCustom>) => Promise<void>
	startingOrder: boolean,
	cancelOrder: () => void,
	cancelingOrder: boolean,
}
type TMenuCustom = TMenu & {quantity: number}
