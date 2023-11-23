import { UIEvent, useEffect, useState } from 'react';

import SideSheet from '#components/base/SideSheet';
import { useAdmin } from '#components/context/useContext';
import Invoice from '#components/layout/Invoice';
import NoContent from '#components/layout/NoContent';
import { TOrder } from '#utils/database/models/order';

import OrdersCard from './OrdersCard';

const OrderHistory = (props: TOrderHistoryProps) => {
	const { onScroll } = props;
	const { orderHistory = [] } = useAdmin();

	const [activeCardID, setActiveCardID] = useState<string>();
	const [activeCardData, setActiveCardData] = useState<TOrder>();
	const [sideSheetOpen, setSideSheetOpen] = useState(false);

	useEffect(() => {
		if (orderHistory?.length === 0) {
			setActiveCardID(undefined);
			setActiveCardData(undefined);
		}
		else if (!orderHistory.some(({ _id }) => _id.toString() === activeCardID)) {
			setActiveCardID(orderHistory[0]?._id.toString());
			setActiveCardData(orderHistory[0]);
		}
	}, [activeCardID, activeCardData, orderHistory]);

	return (
		<div className='orders'>
			{
				orderHistory.length === 0 ? <NoContent label='No order history' animationName='GhostNoContent' />
					: <div className='ordersContent'>
						<div className='list' onScroll={onScroll}>
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

export type TOrderHistoryProps = {
	onScroll: (event: UIEvent<HTMLDivElement>) => void
}
