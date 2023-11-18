import React, { useEffect, useState } from 'react';

import SideSheet from '#components/base/SideSheet';
import { useAdminOrder } from '#components/context/useContext';
import ItemCard from '#components/layout/ItemCard';
import NoContent from '#components/layout/NoContent';
import { TMenu } from '#utils/database/models/menu';
import { TOrder } from '#utils/database/models/order';

import OrderDetail from './OrderDetail';
import OrdersCard from './OrdersCard';

const ActiveOrders = () => {
	const { orderActive, orderAction, orderActionLoading } = useAdminOrder();
	const [activeCardID, setActiveCardID] = useState<string>();
	const [activeCardData, setActiveCardData] = useState<TOrder>();
	const [rejectCard, setRejectCard] = useState<{ _id: string | null, details: boolean }>({ _id: null, details: false });
	const [sideSheetOpen, setSideSheetOpen] = useState(false);

	const onOrderAction = async (orderID: string) => {
		console.log(orderID, rejectCard._id);
		if (orderID === rejectCard._id)
			return await orderAction(orderID, 'reject');

		return await orderAction(orderID, 'complete');
	};

	useEffect(() => {
		if (orderActive.length > 0 && !activeCardData) {
			setActiveCardID(orderActive[0]?._id.toString());
			setActiveCardData(orderActive[0]);
		}
	}, [activeCardID, activeCardData, orderActive]);

	return (
		<div className='orders'>
			{
				orderActive?.length === 0 ? <NoContent label='Nothing to show' animationName='GhostNoContent' />
					: <div className='ordersContent'>
						<div className={`list ${orderActionLoading ? 'disable' : ''}`}>{
							orderActive.map((data, i) => (
								<OrdersCard
									key={i}
									actions
									data={data}
									action={onOrderAction}
									showDetails={setSideSheetOpen}
									details={!!rejectCard?._id && rejectCard.details}
									reject={rejectCard._id === data._id.toString()}
									setReject={setRejectCard}
									active={activeCardID === data._id.toString()}
									busy={orderActionLoading}
									activate={(orderID: string) => {
										setActiveCardID(orderID);
										setActiveCardData(orderActive.find((order) => order._id.toString() === orderID));
									}}
								/>
							))
						}
						</div>
						<div className={`details ${activeCardData && rejectCard._id === activeCardData._id.toString() ? 'reject ' : ''}`}>
							{!activeCardData
								? <NoContent label='No approved orders from this table yet!' animationName='GhostNoContent' size={200} />
								:
								<OrderDetail
									actions
									data={activeCardData}
									action={onOrderAction}
									setReject={setRejectCard}
									busy={orderActionLoading}
									reject={activeCardData && rejectCard._id === activeCardData._id.toString()}
								/>
							}
						</div>
					</div>
			}
			<SideSheet title={[activeCardData ? `Table: ${activeCardData?.table}` : '']} open={sideSheetOpen} setOpen={setSideSheetOpen}>
				{
					activeCardData && activeCardData.products.map((product, key) => {
						return <ItemCard item={product as unknown as TMenuCustom} key={key} staticCard />;
					})
				}
			</SideSheet>
		</div>
	);
};

export default ActiveOrders;

type TMenuCustom = TMenu & {quantity: number}
