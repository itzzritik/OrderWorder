import React from 'react';

import { Button } from 'xtreme-ui';

import { useAdminOrder } from '#components/context/useContext';

const OrdersCard = (props: TOrdersCard) => {
	const { active, reject, setReject, busy, history, data, details, action, activate, showDetails, completeOrder } = props;
	const {} = useAdminOrder();
	const onAction = () => {
		action(data._id);
	};
	const tableName = data.role === 'table' ? data.profile.name : data.restaurant.tableName;
	const customerName = data.role === 'table' ? data.profile.customerName : data.customer.name;

	const optionButtons = () => {
		if (data.role === 'table') {
			if (orderData && !orderData.userOrderEnd) {
				return (
					<div className='options'>
						<Button className='accept' label={!reject ? 'End Session' : 'End'}
							onClick={() => action(data.username)} loading={busy} round
						/>
						{!busy && <Button className='reject' onClick={() => {
							setReject({
								_id: !reject ? data._id : null,
								details: false,
							});
						}} label={!props.reject ? 'End Order' : 'No'}
						          />}
					</div>
				);
			// eslint-disable-next-line no-else-return
			} else if (orderData && orderData.userOrderEnd) {
				return (
					<div className='options'>
						<Button className='accept' label='Complete'
							onClick={() => completeOrder(data.username)} loading={busy}
						/>
					</div>
				);
			}
			return (
				<div className='options'>
					<Button className='accept' label='End Session'
						onClick={() => action(data.username)} loading={busy}
					/>
				</div>
			);
		}
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

	let classList = 'ordersCard ';
	active && (classList += 'active ');
	reject && (classList += 'reject ');
	busy && (classList += 'busy ');

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
					!orderData
						? <p className='noContent'>No orders yet</p>
						: <p className='total rupee' onClick={() => showDetails(true)}>{orderData.total}</p>
				}
				{actions && optionButtons()}
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
