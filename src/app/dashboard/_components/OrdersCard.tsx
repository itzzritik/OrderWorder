import React from 'react';

import clsx from 'clsx';
import { Button } from 'xtreme-ui';

import './ordersCard.scss';

const OrdersCard = (props: TOrdersCard) => {
	const { data, active, reject, setReject, busy, history, details, action, activate, showDetails, completeOrder } = props;
	const onAction = () => {
		action(data._id);
	};
	const tableName = data.table;
	const customerName = data.customer.name;

	const OptionButtons = () => {
		// if (data.role === 'table') {
		// 	if (orderData && !orderData.userOrderEnd) {
		// 		return (
		// 			<div className='options'>
		// 				<Button className='accept' label={!reject ? 'End Session' : 'End'}
		// 					onClick={() => action(data.username)} loading={busy} round
		// 				/>
		// 				{!busy && <Button className='reject' onClick={() => {
		// 					setReject({
		// 						_id: !reject ? data._id : null,
		// 						details: false,
		// 					});
		// 				}} label={!props.reject ? 'End Order' : 'No'}
		// 				          />}
		// 			</div>
		// 		);
		// 	// eslint-disable-next-line no-else-return
		// 	} else if (orderData && orderData.userOrderEnd) {
		// 		return (
		// 			<div className='options'>
		// 				<Button className='accept' label='Complete'
		// 					onClick={() => completeOrder(data.username)} loading={busy}
		// 				/>
		// 			</div>
		// 		);
		// 	}
		// 	return (
		// 		<div className='options'>
		// 			<Button className='accept' label='End Session'
		// 				onClick={() => action(data.username)} loading={busy}
		// 			/>
		// 		</div>
		// 	);
		// }
		return (
			<div className='options'>
				<Button className='accept' label={!reject ? 'Accept' : 'Reject'}
					onClick={onAction} loading={busy}
				/>
				{
					!busy &&
					<Button
						className='reject'
						onClick={() => {
							setReject({
								_id: !reject ? data._id : null,
								details: false,
							});
						}} label={!reject ? 'Reject' : 'No'}
					/>
				}
			</div>
		);
	};

	const classList = clsx(
		'ordersCard',
		active && 'active',
		reject && 'reject',
		busy && 'busy',
	);

	return (
		<div className={classList}
			onClick={() => {
				!active && !history && setReject({ _id: null, details: false });
				activate(data._id);
			}}
		>
			<div className='content'>
				<p className='table'>{!reject || details ? tableName : 'Are you sure?'}</p>
				<p className='name'>{!reject || details ? customerName : tableName}</p>
				{
					!data?.products?.length
						? <p className='noContent'>No orders yet</p>
						: <p className='total rupee' onClick={() => showDetails(true)}>{data?.orderTotal}</p>
				}
				<OptionButtons />
			</div>
		</div>
	);
};

export default OrdersCard;

type TOrdersCard = {
	active: boolean
	reject: boolean
	busy: boolean

	// action
	// reject
	// details
	// history
	// activate
	// setReject
}
