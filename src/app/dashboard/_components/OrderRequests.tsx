import React, { useEffect, useState } from 'react';

import NoContent from '#components/base/NoContent';
import SideSheet from '#components/base/SideSheet';
import { useAdminOrder } from '#components/context/useContext';

import ItemCard from '../../[restaurant]/_components/ItemCard';

const OrderRequests = () => {
	const { orderRequest, acceptOrder, acceptingOrder, rejectOrder, rejectingOrder } = useAdminOrder();
	const [activeCardID, setActiveCardID] = useState();
	const [activeCardData, setActiveCardData] = useState();
	const [busyCards, setBusyCards] = useState([]);
	const [rejectCard, setRejectCard] = useState({ _id: null, details: false });
	const [sideSheetOpen, setSideSheetOpen] = useState(false);

	const onOrderAction = () => {

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
				orderRequest.length === 0 ? <NoContent label='Nothing to show' />
					: <div className='ordersContent'>
						{
							orderRequest.map((data, i) =>
								(
									<OrdersCard key={i} data={data} action={onOrderAction} showDetails={setSideSheetOpen}
										details={rejectCard._id && rejectCard.details}
										reject={rejectCard._id === data._id} setReject={setRejectCard}
										active={activeCardID === data._id} busy={busyCards.includes(data._id)}
										activate={(orderID) => {
											setActiveCardID(orderID);
											setActiveCardData(orderRequest.find((order) => order._id === orderID));
										}} actions
									/>
								),
							)
						}
						<div className={`details ${activeCardData && rejectCard._id === activeCardData._id ? 'reject ' : ''}`}>
							{
								!activeCardData
									? <NoContent label='Nothing to display' />
									: (
										<div />

								// <OrderDetail data={activeCardData}
								// 	action={onOrderAction} setReject={setRejectCard}
								// 	busy={activeCardData && busyCards.includes(activeCardData._id)}
								// 	reject={activeCardData && rejectCard._id === activeCardData._id} actions
								// />
									)
							}
						</div>
					</div>
			}
			<SideSheet title={[activeCardData && activeCardData.restaurant.tableName]}
				open={sideSheetOpen} setOpen={setSideSheetOpen}
			>
				{
					activeCardData && activeCardData.products.map((product, key) => {
						const productData = Menu.findOne({ _id: product._id });
						product = { ...product, ...productData };
						return <ItemCard item={product} key={key} staticCard />;
					})
				}
			</SideSheet>
		</div>
	);
};

export default OrderRequests;
