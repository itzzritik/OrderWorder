import React, { useState } from 'react';

import { useSearchParams } from 'next/navigation';
import { Button, Icon, Spinner } from 'xtreme-ui';

import NoContent from '#components/layout/NoContent';
import { TMenu } from '#utils/database/models/menu';
import { TOrder } from '#utils/database/models/order';

import ItemCard from '../../../components/layout/ItemCard';

import './orderDetail.scss';

const OrderDetail = (props: TOrderDetailProps) => {
	const { data, actions, busy, reject } = props;
	const queryParams = useSearchParams();
	const subTab = queryParams.get('subTab') ?? '';

	const [loading] = useState(false);

	// Show empty when no data is provided
	if (!data) return null;

	// Show loading page
	if (loading) {
		return <Spinner fullpage />;
	}

	const OptionButtons = () => {
		if (!actions) return null;

		if (subTab === 'active') {
			if (data.products.length === 0) {
				return (
					<div className='options'>
						<Button className='accept' label='End Session' iconType='solid'
							onClick={() => props.action(data?.table)} loading={busy}
						/>
					</div>
				);
			// eslint-disable-next-line no-else-return
			} else if (data.userOrderEnd) {
				return (
					<div className='options'>
						<Button className='accept' label='Complete' iconType='solid'
							onClick={() => props.completeOrder(data?.table)} loading={busy}
						/>
					</div>
				);
			}
			return (
				<div className='options'>
					<Button className='reject' type='primaryDanger' icon='f00d' iconType='solid' onClick={() => {
						props.setReject({
							_id: !reject ? data._id.toString() : null,
							details: true,
						});
					}} label={!reject ? 'End Order' : 'No'}
					/>
					<Button className='accept' icon='f00c' iconType='solid' label={!reject ? 'End Session' : 'End'}
						onClick={() => props.action(data?.table)} loading={busy}
					/>
				</div>
			);
		}
		return (
			<div className={`options ${busy ? 'busy ' : ''}`}>
				<Button className='reject' type='primaryDanger' icon='f00d' iconType='solid' onClick={() => {
					props.setReject({
						_id: !reject ? data._id.toString() : null,
						details: true,
					});
				}} label={!reject ? 'Reject' : 'Nope'}
				/>
				<Button className='accept'icon='f00c' iconType='solid' label={!reject ? 'Accept' : 'Reject'}
					onClick={() => props.action(data._id.toString())} loading={busy}
				/>
			</div>
		);
	};

	return (
		<div className={`orderDetail ${reject ? 'reject ' : ''}`}>
			<div className='header'>
				<div className='info'>
					<h1 className='table'>{!reject ? `Table: ${data?.table}` : 'Are you sure?'}</h1>
					<div className='name'>
						<Icon code='f007' type='solid' size={16} />
						{data?.customer?.fname} {data?.customer?.lname}
					</div>
					<div className='phone'>
						<Icon code='f095' type='solid' size={16} />
						{data?.customer?.phone}
					</div>
					{
						data?.orderTotal && <div className='total'>
							<Icon code='e1bc' type='solid' size={16} />
							{data?.orderTotal}
						</div>
					}
				</div>
				<OptionButtons />
			</div>
			<div className='detailContent'>
				{
					data?.products?.length === 0
						? <NoContent label='No approved orders from this table yet!' animationName='GhostNoContent' />
						: data.products.map((product, key) => (<ItemCard item={product as unknown as TMenuCustom} key={key} staticCard />))
				}
			</div>
		</div>
	);
};

export default OrderDetail;

export type TOrderDetailProps = {
	data: TOrder
	actions?: boolean
	action: (id: string) => void
	busy: boolean
	reject: boolean
	setReject: (props: { _id: string | null, details: boolean }) => void
}
type TMenuCustom = TMenu & {quantity: number}
