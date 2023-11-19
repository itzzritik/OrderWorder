import { useMemo, useState } from 'react';

import { useSearchParams } from 'next/navigation';
import { Button, Icon } from 'xtreme-ui';

import Collapsible from '#components/layout/Collapsible';
import NoContent from '#components/layout/NoContent';
import { TMenu } from '#utils/database/models/menu';
import { TOrder } from '#utils/database/models/order';

import ItemCard from '../../../../components/layout/ItemCard';

import './orderDetail.scss';

const OrderDetail = (props: TOrderDetailProps) => {
	const { data, actions, busy, reject, setReject, action } = props;
	const queryParams = useSearchParams();
	const subTab = queryParams.get('subTab') ?? '';

	const [showApprovedItems, setShowApprovedItems] = useState(false);

	const { approvedItems, requestedItems } = useMemo(() => ({
		approvedItems: data.products.filter(({ adminApproved }) => adminApproved),
		requestedItems: data.products.filter(({ adminApproved }) => !adminApproved),
	}), [data.products]);

	const OptionButtons = () => {
		if (!actions) return null;

		if (subTab === 'active') {
			return (
				<div className='options'>
					<Button className='reject' type='primaryDanger' icon='f00d' iconType='solid' onClick={() => {
						setReject({
							_id: !reject ? data._id.toString() : null,
							details: true,
						});
					}} label={!reject ? 'Cancel' : 'No Don\'t'}
					/>
					<Button className='accept' icon='f00c' iconType='solid' label={!reject ? 'Complete' : 'Yes do it!'}
						onClick={() => action(data._id.toString())} loading={busy}
					/>
				</div>
			);
		}
		return (
			<div className={`options ${busy ? 'busy ' : ''}`}>
				<Button className='reject' type='primaryDanger' icon='f00d' iconType='solid' onClick={() => {
					setReject({
						_id: !reject ? data._id.toString() : null,
						details: true,
					});
				}} label={!reject ? 'Reject' : 'No Don\'t'}
				/>
				<Button className='accept'icon='f00c' iconType='solid' label={!reject ? 'Accept' : 'Yes do it!'}
					onClick={() => action(data._id.toString())} loading={busy}
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
						: (
							subTab !== 'requests' || !approvedItems.length
								? data.products.map((product, key) => (
									<ItemCard item={product as unknown as TMenuCustom} key={key} staticCard />
								))
								:
								<div>
									<Collapsible
										className='orderedProducts'
										round
										label='Approved Products'
										expand={showApprovedItems}
										setExpand={setShowApprovedItems}
										alert={approvedItems?.length}
									>
										{
											approvedItems.map((product, key) =>
												<ItemCard key={key} item={product as unknown as TMenuCustom} staticCard />,
											)
										}
									</Collapsible>
									{
										requestedItems.map((product, key) => (
											<ItemCard item={product as unknown as TMenuCustom} key={key} staticCard />
										))
									}
								</div>

						)
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
