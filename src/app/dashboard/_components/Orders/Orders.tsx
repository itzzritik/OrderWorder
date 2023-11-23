import { UIEvent } from 'react';

import { useSearchParams } from 'next/navigation';
import { Spinner } from 'xtreme-ui';

import { useAdmin } from '#components/context/useContext';

import ActiveOrders from './ActiveOrders';
import OrderHistory from './OrderHistory';
import OrderRequests from './OrderRequests';
import './orders.scss';

const Orders = (props: TOrdersProps) => {
	const { onScroll } = props;
	const { orderLoading } = useAdmin();
	const queryParams = useSearchParams();
	const subTab = queryParams.get('subTab') ?? '';

	if (orderLoading) return <Spinner fullpage label='Fetching orders...' />;

	if (subTab === 'requests') {
		return <OrderRequests onScroll={onScroll} />;
	}

	if (subTab === 'active') {
		return <ActiveOrders onScroll={onScroll} />;
	}

	if (subTab === 'history') {
		return <OrderHistory onScroll={onScroll} />;
	}
};

export default Orders;

export type TOrdersProps = {
	onScroll: (event: UIEvent<HTMLDivElement>) => void
}
