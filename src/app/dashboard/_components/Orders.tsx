import React from 'react';

import { useSearchParams } from 'next/navigation';

import OrderRequests from './OrderRequests';
import './orders.scss';

const Orders = () => {
	const queryParams = useSearchParams();
	const tab = queryParams.get('tab') ?? '';

	if (tab === 'requests') {
		return <OrderRequests />;
	}

	// if (tab === 'active') {
	// 	return <ActiveOrders />;
	// }

	// if (tab === 'history') {
	// 	return <OrderHistory />;
	// }
};

export default Orders;
