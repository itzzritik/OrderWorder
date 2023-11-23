import { UIEvent, useEffect, useState } from 'react';

import SideSheet from '#components/base/SideSheet';
import { useAdmin } from '#components/context/useContext';
import NoContent from '#components/layout/NoContent';
import { TMenu } from '#utils/database/models/menu';
import { TOrder } from '#utils/database/models/order';

import ItemCard from '../../../../components/layout/ItemCard';

import OrderDetail from './OrderDetail';
import OrdersCard from './OrdersCard';

const OrderRequests = (props: TOrderRequestsProps) => {
	const { onScroll } = props;
	const { orderRequest = [], orderAction, orderActionLoading } = useAdmin();
	const [activeCardID, setActiveCardID] = useState<string>();
	const [activeCardData, setActiveCardData] = useState<TOrder>();
	const [rejectCard, setRejectCard] = useState<{ _id: string | null, details: boolean }>({ _id: null, details: false });
	const [sideSheetOpen, setSideSheetOpen] = useState(false);

	const onOrderAction = async (orderID: string) => {
		if (orderID === rejectCard._id)
			return await orderAction(orderID, 'reject');

		return await orderAction(orderID, 'accept');
	};

	useEffect(() => {
		if (orderRequest.length === 0) {
			setActiveCardID(undefined);
			setActiveCardData(undefined);
		}
		else if (!orderRequest.some(({ _id }) => _id.toString() === activeCardID)) {
			setActiveCardID(orderRequest[0]?._id.toString());
			setActiveCardData(orderRequest[0]);
		}
	}, [activeCardID, activeCardData, orderRequest]);

	return (
		<div className='orders'>
			{
				orderRequest?.length === 0 ? <NoContent label='No order requests' animationName='GhostNoContent' />
					: <div className='ordersContent'>
						<div className={`list ${orderActionLoading ? 'disable' : ''}`} onScroll={onScroll}>
							{
								orderRequest?.map?.((data, i) =>
									(
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
												setActiveCardData(orderRequest.find((order) => order._id.toString() === orderID));
											}}
										/>
									),
								)
							}
						</div>
						<div className={`details ${activeCardData && rejectCard._id === activeCardData._id.toString() ? 'reject ' : ''}`}>
							{
								!activeCardData
									? <NoContent label='Nothing to show' animationName='GhostNoContent' size={200} />
									: (
										<OrderDetail
											actions
											data={activeCardData}
											action={onOrderAction}
											setReject={setRejectCard}
											busy={orderActionLoading}
											reject={activeCardData && rejectCard._id === activeCardData._id.toString()}
										/>
									)
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

export default OrderRequests;

export type TOrderRequestsProps = {
	onScroll: (event: UIEvent<HTMLDivElement>) => void
}
type TMenuCustom = TMenu & {quantity: number}
