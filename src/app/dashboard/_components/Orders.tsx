import React from 'react';

import { useSearchParams } from 'next/navigation';

import OrderHistory from './OrderHistory';
import OrderRequests from './OrderRequests';
import './orders.scss';

const Orders = () => {
	const queryParams = useSearchParams();
	const subTab = queryParams.get('subTab') ?? '';

	if (subTab === 'requests') {
		return <OrderRequests />;
	}

	// if (subTab === 'active') {
	// 	return <ActiveOrders />;
	// }

	if (subTab === 'history') {
		return <OrderHistory />;
	}
};

export default Orders;
