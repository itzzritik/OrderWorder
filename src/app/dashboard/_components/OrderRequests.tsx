import React, { useEffect, useState } from 'react';

import NoContent from '#components/base/NoContent';
import SideSheet from '#components/base/SideSheet';
import { useAdminOrder, useRestaurant } from '#components/context/useContext';
import { TMenu } from '#utils/database/models/menu';
import { TOrder } from '#utils/database/models/order';

import ItemCard from '../../../components/base/ItemCard';

import OrderDetail from './OrderDetail';
import OrdersCard from './OrdersCard';

const OrderRequests = () => {
	const { orderRequest, acceptOrder, rejectOrder, orderActionLoading } = useAdminOrder();
	const { restaurant } = useRestaurant();
	const menu = restaurant?.menus as Array<TMenuCustom>;
	const [activeCardID, setActiveCardID] = useState<string>();
	const [activeCardData, setActiveCardData] = useState<TOrder>();
	const [rejectCard, setRejectCard] = useState<{ _id: string | null, details: boolean }>({ _id: null, details: false });
	const [sideSheetOpen, setSideSheetOpen] = useState(false);

	const onOrderAction = async (orderID: string) => {
		if (orderID === rejectCard._id) {
			return await rejectOrder(orderID);
		}

		return await acceptOrder(orderID);
	};

	useEffect(() => {
		if (orderRequest.length > 0 && !activeCardData) {
			setActiveCardID(orderRequest[0]?._id.toString());
			setActiveCardData(orderRequest[0]);
		}
	}, [activeCardID, activeCardData, orderRequest]);

	return (
		<div className='orders'>
			{
				orderRequest?.length === 0 ? <NoContent label='Nothing to show' animationName='GhostNoContent' />
					: <div className='ordersContent'>
						<div className='list'>
							{
								orderRequest?.map?.((data, i) =>
									(
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
												setActiveCardData(orderRequest.find((order) => order._id.toString() === orderID));
											}}
										/>
									),
								)
							}
						</div>
						<div className={`details ${activeCardData && rejectCard._id === activeCardData._id.toString() ? 'reject ' : ''}`}>
							{
								!activeCardData
									? <NoContent label='No orders yet' animationName='GhostNoContent' size={200} />
									: (
										<OrderDetail
											actions
											data={activeCardData}
											action={onOrderAction}
											setReject={setRejectCard}
											busy={orderActionLoading}
											reject={activeCardData && rejectCard._id === activeCardData._id.toString()}
										/>
									)
							}
						</div>
					</div>
			}
			<SideSheet title={[activeCardData ? `Table: ${activeCardData?.table}` : '']} open={sideSheetOpen} setOpen={setSideSheetOpen}>
				{
					activeCardData && activeCardData.products.map((product, key) => {
						const productData = menu?.find?.((menu) => (menu._id === product._id));
						product = { ...product, ...productData };
						return <ItemCard item={product as unknown as TMenuCustom} key={key} staticCard />;
					})
				}
			</SideSheet>
		</div>
	);
};

export default OrderRequests;

type TMenuCustom = TMenu & {quantity: number}
