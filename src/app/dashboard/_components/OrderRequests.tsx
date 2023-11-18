import React, { useEffect, useState } from 'react';

import NoContent from '#components/base/NoContent';
import SideSheet from '#components/base/SideSheet';
import { useAdminOrder, useRestaurant } from '#components/context/useContext';
import { TMenu } from '#utils/database/models/menu';

import ItemCard from '../../../components/base/ItemCard';

import OrderDetail from './OrderDetail';
import OrdersCard from './OrdersCard';

const OrderRequests = () => {
	const { orderRequest, acceptOrder, acceptingOrder, rejectOrder, rejectingOrder } = useAdminOrder();
	const { restaurant } = useRestaurant();
	const menu = restaurant?.menus as Array<TMenuCustom>;
	const [activeCardID, setActiveCardID] = useState();
	const [activeCardData, setActiveCardData] = useState();
	const [busyCards, setBusyCards] = useState([]);
	const [rejectCard, setRejectCard] = useState({ _id: null, details: false });
	const [sideSheetOpen, setSideSheetOpen] = useState(false);

	const onOrderAction = {

	};

	useEffect(() => {
		if (!activeCardID) {
			setActiveCardData(undefined);
			setSideSheetOpen(false);
		}
	}, [activeCardID]);

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
											data={data}
											action={onOrderAction}
											showDetails={setSideSheetOpen}
											details={rejectCard._id && rejectCard.details}
											reject={rejectCard._id === data._id}
											setReject={setRejectCard}
											active={activeCardID === data._id}
											busy={busyCards.includes(data._id)}
											activate={(orderID) => {
												setActiveCardID(orderID);
												setActiveCardData(orderRequest.find((order) => order._id === orderID));
											}}
											actions
										/>
									),
								)
							}
						</div>
						<div className={`details ${activeCardData && rejectCard._id === activeCardData._id ? 'reject ' : ''}`}>
							{
								!activeCardData
									? <NoContent label='No orders yet' animationName='GhostNoContent' size={200} />
									: (
										<OrderDetail data={activeCardData}
											action={onOrderAction} setReject={setRejectCard}
											busy={activeCardData && busyCards.includes(activeCardData._id)}
											reject={activeCardData && rejectCard._id === activeCardData._id} actions
										/>
									)
							}
						</div>
					</div>
			}
			<SideSheet title={[activeCardData && activeCardData?.table]}
				open={sideSheetOpen} setOpen={setSideSheetOpen}
			>
				{
					activeCardData && activeCardData.products.map((product, key) => {
						const productData = menu?.find?.((menu) => (menu._id === product._id));
						product = { ...product, ...productData };
						return <ItemCard item={product} key={key} staticCard />;
					})
				}
			</SideSheet>
		</div>
	);
};

export default OrderRequests;

type TMenuCustom = TMenu & {quantity: number}
