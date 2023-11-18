import React, { useState, useEffect } from 'react';

import { useSearchParams } from 'next/navigation';
import { Button, Icon, Spinner } from 'xtreme-ui';

import NoContent from '#components/base/NoContent';

import ItemCard from '../../../components/base/ItemCard';

import './orderDetail.scss';

const OrderDetail = (props: TOrderDetailProps) => {
	const { data } = props;
	console.log(data);
	const queryParams = useSearchParams();
	const subTab = queryParams.get('subTab') ?? '';

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(false);
	}, []);

	// Show empty when no data is provided
	if (!data) return null;

	// Show loading page
	if (loading) {
		return <Spinner fullpage />;
	}

	const optionButtons = () => {
		if (subTab === 'active') {
			if (data.products.length === 0) {
				return (
					<div className='options'>
						<Button className='accept' label='End Session'
							onClick={() => props.action(data.table)} loading={props.busy} round
						/>
					</div>
				);
			// eslint-disable-next-line no-else-return
			} else if (data.userOrderEnd) {
				return (
					<div className='options'>
						<Button className='accept' label='Complete'
							onClick={() => props.completeOrder(data.table)} loading={props.busy} round
						/>
					</div>
				);
			}
			return (
				<div className='options'>
					<Button className='reject' round onClick={() => {
						props.setReject({
							_id: !props.reject ? data._id : null,
							details: true,
						});
					}} label={!props.reject ? 'End Order' : 'No'}
					/>
					<Button className='accept' label={!props.reject ? 'End Session' : 'End'} round
						onClick={() => props.action(data.table)} loading={props.busy}
					/>
				</div>
			);
		}
		return (
			<div className={`options ${props.busy ? 'busy ' : ''}`}>
				<Button className='reject' round onClick={() => {
					props.setReject({
						_id: !props.reject ? data._id : null,
						details: true,
					});
				}} label={!props.reject ? 'Reject' : 'No'}
				/>
				<Button className='accept' label={!props.reject ? 'Accept' : 'Reject'} round
					onClick={() => props.action(data._id)} loading={props.busy}
				/>
			</div>
		);
	};

	const productDetails = () => {
		// if (orderData.userOrderEnd) {
		// 	return <Invoice order={orderData} />;
		// }
		return data.products.map((product, key) => {
			const productData = menu.find((menu) => (menu._id === product._id));
			product = { ...product, ...productData };
			return <ItemCard item={product} key={key} staticCard />;
		});
	};

	return (
		<div className={`orderDetail ${props.reject ? 'reject ' : ''}`}>
			<div className='header'>
				<div className='info'>
					<h1 className='table'>{!props.reject ? orderData.restaurant.tableName : 'Are you sure?'}</h1>
					<div className='name'>
						<Icon code='f007' />
						{data.customer.name}
					</div>
					<div className='phone'>
						<Icon code='f095' />
						{data.customer.phoneNumber}
					</div>
					{ !data.total ? <div /> : <div className='total rupee'>{data.total}</div> }
				</div>
				{props.actions && optionButtons()}
			</div>
			<div className='detailContent' trackSize='small'>
				{
					data.products.length === 0
						? <NoContent label='No approved orders from this table yet!' animationName='' />
						: productDetails()
				}
			</div>
		</div>
	);
};

export default OrderDetail;

export type TOrderDetailProps = {

	// data
	// busy
	// reject
	// setReject
	// actions
}
