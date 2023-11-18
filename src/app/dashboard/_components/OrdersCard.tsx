import React from 'react';

import clsx from 'clsx';
import { Button } from 'xtreme-ui';

import { TOrder } from '#utils/database/models/order';

import './ordersCard.scss';

const OrdersCard = (props: TOrdersCard) => {
	const { data, actions, active, reject, setReject, busy, history, details, action, activate, showDetails, completeOrder } = props;
	const onAction = () => {
		action(data._id.toString());
	};
	const tableName = data.table;
	const customerName = `${data?.customer?.fname} ${data?.customer?.lname}`;

	const OptionButtons = () => {
		if (!actions) return null;

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
					size='mini'
					icon='f00c' iconType='solid'
					onClick={onAction} loading={busy}
				/>
				{
					!busy &&
					<Button
						className='reject'
						size='mini'
						type='primaryDanger' icon='f00d' iconType='solid'
						onClick={() => {
							setReject({
								_id: !reject ? data._id.toString() : null,
								details: false,
							});
						}} label={!reject ? 'Reject' : 'Nope'}
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
				activate(data._id.toString());
			}}
		>
			<div className='content'>
				<p className='table'>{!reject || details ? `Table: ${tableName}` : 'Are you sure?'}</p>
				<p className='name'>{!reject || details ? customerName : `Table: ${tableName}`}</p>
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
	data: TOrder
	actions?: boolean
	active: boolean
	reject: boolean
	setReject: (props: { _id: string | null, details: boolean }) => void
	busy: boolean
	details: boolean
	action: (id: string) => void
	showDetails: (value: boolean) => void
	activate: (id: string) => void
}
