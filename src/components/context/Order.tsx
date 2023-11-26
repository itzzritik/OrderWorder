import { createContext, ReactNode, useEffect, useState } from 'react';

import noop from 'lodash/noop';
import pick from 'lodash/pick';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import useSWR from 'swr';

import { TMenu } from '#utils/database/models/menu';
import { TOrder } from '#utils/database/models/order';
import { fetcher } from '#utils/helper/common';

const OrderDefault: TOrderInitialType = {
	order: undefined,
	loading: false,
	placeOrder: () => new Promise(noop),
	placingOrder: false,
	cancelOrder: noop,
	cancelingOrder: false,
};

export const OrderContext = createContext(OrderDefault);
export const OrderProvider = ({ children }: TOrderProviderProps) => {
	const session = useSession();
	const authenticated = session.status === 'authenticated';
	const { data: order, isLoading: loading, mutate } = useSWR(authenticated ? '/api/order' : null, fetcher, { refreshInterval: 5000 });

	const [placingOrder, setPlacingOrder] = useState(false);
	const [cancelingOrder, setCancelingOrder] = useState(false);

	const placeOrder = async (products: Array<TMenuCustom>) => {
		setPlacingOrder(true);
		const req = await fetch('/api/order/place', { method: 'POST', body: JSON.stringify({
			products: products.map((product) => pick(product, ['_id', 'quantity'])),
		}) });
		const res = await req.json();

		if (!req.ok) toast.error(res?.message);
		await mutate();
		setPlacingOrder(false);
	};
	const cancelOrder = async () => {
		setCancelingOrder(true);
		const req = await fetch('/api/order/cancel', { method: 'POST' });
		const res = await req.json();

		if (!req.ok) toast.error(res?.message);
		await mutate();
		setCancelingOrder(false);
	};

	useEffect(() => {
		mutate();
	}, [mutate, session.status]);

	return (
		<OrderContext.Provider value={{ order, loading, placeOrder, placingOrder, cancelOrder, cancelingOrder }}>
			{children}
		</OrderContext.Provider>
	);
};

export type TOrderProviderProps = {
    children?: ReactNode
}

export type TOrderInitialType = {
	order?: TOrder,
	loading: boolean,
	placeOrder: (products: Array<TMenuCustom>) => Promise<void>
	placingOrder: boolean,
	cancelOrder: () => void,
	cancelingOrder: boolean,
}
type TMenuCustom = TMenu & {quantity: number}
