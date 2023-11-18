import React, { useEffect, useState } from 'react';

import SideSheet from '#components/base/SideSheet';
import { useAdminOrder } from '#components/context/useContext';
import Invoice from '#components/layout/Invoice';
import NoContent from '#components/layout/NoContent';
import { TOrder } from '#utils/database/models/order';

import OrdersCard from './OrdersCard';

const OrderHistory = () => {
	const { orderHistory } = useAdminOrder();

	const [activeCardID, setActiveCardID] = useState<string>();
	const [activeCardData, setActiveCardData] = useState<TOrder>();
	const [sideSheetOpen, setSideSheetOpen] = useState(false);

	useEffect(() => {
		if (orderHistory.length > 0 && !activeCardData) {
			setActiveCardID(orderHistory[0]?._id.toString());
			setActiveCardData(orderHistory[0]);
		}
	}, [activeCardID, activeCardData, orderHistory]);

	return (
		<div className='orders'>
			{
				orderHistory.length === 0 ? <NoContent label='No order history' animationName='GhostNoContent' />
					: <div className='ordersContent'>
						<div className='list'>
							{
								orderHistory.map((data, i) => (
									<OrdersCard
										key={i}
										history
										data={data}
										showDetails={setSideSheetOpen}
										active={activeCardID === data._id.toString()}
										activate={(orderID) => {
											setActiveCardID(orderID);
											setActiveCardData(orderHistory.find((order) => order._id.toString() === orderID));
										}}
									/>
								))
							}
						</div>
						<div className='details'>
							{!activeCardData
								? <NoContent label='No orders yet' animationName='GhostNoContent' size={200} />
								: <Invoice order={activeCardData} />}
						</div>
					</div>
			}
			<SideSheet title={['Invoice']} open={sideSheetOpen} setOpen={setSideSheetOpen}>
				{
					activeCardData && <Invoice order={activeCardData} />
				}
			</SideSheet>
		</div>
	);
};

export default OrderHistory;
