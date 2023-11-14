import React, { useEffect, useState } from 'react';

import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';

import { AdminOrder, Menu } from '../../../../models';
import ItemCard from '../../Base/ItemCard.jsx';
import NoContent from '../../Base/NoContent.jsx';
import SideSheet from '../../Base/SideSheet.jsx';

import OrderDetail from './OrderDetail.jsx';
import OrdersCard from './OrdersCard.jsx';

const OrderRequests = (props) => {
	const [activeCardID, setActiveCardID] = useState();
	const [activeCardData, setActiveCardData] = useState();
	const [busyCards, setBusyCards] = useState([]);
	const [rejectCard, setRejectCard] = useState({ _id: null, details: false });
	const [sideSheetOpen, setSideSheetOpen] = useState(false);

	const orders = useTracker(() => {
		const query = { adminApproved: false };
		const orderList = AdminOrder.find(query).fetch();

		// Set first card active on first load
		if (orderList.length && activeCardID === undefined) {
			setActiveCardID(orderList[0]._id);
			setActiveCardData(orderList[0]);
		}

		// Remove Card when its associated order is resolved.
		if (!orderList.some((order) => order._id === activeCardID)) {
			activeCardID && setActiveCardID(null);
			rejectCard._id && setRejectCard({ _id: null, details: false });
		}

		return orderList;
	});

	const onOrderAction = (cardOrderID) => {
		const updateOrder = (action) => {
			Meteor.call('adminOrderAction', cardOrderID, action, (err) => {
				setBusyCards((busyCards) => busyCards.filter((cardID) => cardOrderID !== cardID));

				if (err) {
					return console.log(err);
				}
			});
		};

		setBusyCards((busyCards) => [...busyCards, cardOrderID]);

		// Rejecting order with orderID = cardOrderID
		if (cardOrderID === rejectCard._id) {
			return updateOrder('REJECT');
		}

		// Accepting order with orderID = cardOrderID
		return updateOrder('APPROVE');
	};

	// Set activeCardID as `undefined` when tab changes
	useEffect(() => {
		setActiveCardID();
	}, [props.tab]);

	// Update ActiveCardData when activeCardID is changed
	useEffect(() => {
		if (!activeCardID) {
			setActiveCardData(null);
			setSideSheetOpen(false);
		}
	}, [activeCardID]);

	return (
		<div className='orders'>
			{
				orders.length === 0 ? <NoContent label='Nothing to show' icon='/icons/Base/pan.svg' />
					: <div className='ordersContent'>
						{
							orders.map((data, i) =>
								(
									<OrdersCard key={i} data={data} action={onOrderAction} showDetails={setSideSheetOpen}
										details={rejectCard._id && rejectCard.details}
										reject={rejectCard._id === data._id} setReject={setRejectCard}
										active={activeCardID === data._id} busy={busyCards.includes(data._id)}
										activate={(orderID) => {
											setActiveCardID(orderID);
											setActiveCardData(orders.find((order) => order._id === orderID));
										}} actions
									/>
								),
							)
						}
						<div className={`details ${activeCardData && rejectCard._id === activeCardData._id ? 'reject ' : ''}`}>
							{
								!activeCardData
									? <NoContent label='Nothing to display' icon='/icons/Base/pan.svg' />
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
