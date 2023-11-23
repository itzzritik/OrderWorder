import { UIEvent, useEffect, useState } from 'react';

import SideSheet from '#components/base/SideSheet';
import { useAdmin } from '#components/context/useContext';
import ItemCard from '#components/layout/ItemCard';
import NoContent from '#components/layout/NoContent';
import { TMenu } from '#utils/database/models/menu';
import { TOrder } from '#utils/database/models/order';

import OrderDetail from './OrderDetail';
import OrdersCard from './OrdersCard';

const ActiveOrders = (props: TActiveOrdersProps) => {
	const { onScroll } = props;
	const { orderActive = [], orderAction, orderActionLoading } = useAdmin();
	const [activeCardID, setActiveCardID] = useState<string>();
	const [activeCardData, setActiveCardData] = useState<TOrder>();
	const [rejectCard, setRejectCard] = useState<{ _id: string | null, details: boolean }>({ _id: null, details: false });
	const [sideSheetOpen, setSideSheetOpen] = useState(false);

	const onOrderAction = async (orderID: string) => {
		if (orderID === rejectCard._id)
			return await orderAction(orderID, 'rejectOnActive');

		return await orderAction(orderID, 'complete');
	};

	useEffect(() => {
		if (orderActive?.length === 0) {
			setActiveCardID(undefined);
			setActiveCardData(undefined);
		}
		else if (!orderActive.some(({ _id }) => _id.toString() === activeCardID)) {
			setActiveCardID(orderActive[0]?._id.toString());
			setActiveCardData(orderActive[0]);
		}
	}, [activeCardID, activeCardData, orderActive]);

	return (
		<div className='orders'>
			{
				orderActive?.length === 0 ? <NoContent label='No active orders' animationName='GhostNoContent' />
					: <div className='ordersContent'>
						<div className={`list ${orderActionLoading ? 'disable' : ''}`} onScroll={onScroll}>{
							orderActive.map((data, i) => (
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
										setActiveCardData(orderActive.find((order) => order._id.toString() === orderID));
									}}
								/>
							))
						}
						</div>
						<div className={`details ${activeCardData && rejectCard._id === activeCardData._id.toString() ? 'reject ' : ''}`}>
							{!activeCardData
								? <NoContent label='No approved orders from this table yet!' animationName='GhostNoContent' size={200} />
								:
								<OrderDetail
									actions
									data={activeCardData}
									action={onOrderAction}
									setReject={setRejectCard}
									busy={orderActionLoading}
									reject={activeCardData && rejectCard._id === activeCardData._id.toString()}
								/>
							}
						</div>
					</div>
			}
			<SideSheet title={[activeCardData ? `Table: ${activeCardData?.table}` : '']} open={sideSheetOpen} setOpen={setSideSheetOpen}>
				{
					activeCardData && activeCardData.products.map((product, key) => {
						return <ItemCard item={product as unknown as TMenuCustom} key={key} staticCard />;
					})
				}
			</SideSheet>
		</div>
	);
};

export default ActiveOrders;

export type TActiveOrdersProps = {
	onScroll: (event: UIEvent<HTMLDivElement>) => void
}

type TMenuCustom = TMenu & {quantity: number}
