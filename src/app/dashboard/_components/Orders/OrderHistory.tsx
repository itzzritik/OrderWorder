import { type UIEvent, useEffect, useState } from "react";

import SideSheet from "#components/base/SideSheet";
import { useAdmin } from "#components/context/useContext";
import NoContent from "#components/layout/NoContent";
import type { TOrder } from "#utils/database/models/order";
import OrderDetails from "./OrderDetails";

import OrdersCard from "./OrdersCard";

const OrderHistory = (props: TOrderHistoryProps) => {
	const { onScroll } = props;
	const { orderHistory = [], profile } = useAdmin();

	const [activeCardID, setActiveCardID] = useState<string>();
	const [activeCardData, setActiveCardData] = useState<TOrder & { _id: string; createdAt: string | Date }>();
	const [sideSheetOpen, setSideSheetOpen] = useState(false);

	useEffect(() => {
		if (orderHistory?.length === 0) {
			setActiveCardID(undefined);
			setActiveCardData(undefined);
		} else if (!orderHistory.some(({ _id }) => _id.toString() === activeCardID)) {
			setActiveCardID(orderHistory[0]?._id.toString());
			setActiveCardData(orderHistory[0] as TOrder & { _id: string; createdAt: string | Date });
		}
	}, [activeCardID, orderHistory]);

	return (
		<div className="orders">
			{orderHistory.length === 0 ? (
				<NoContent animationName="GhostNoContent" label="No order history" />
			) : (
				<div className="ordersContent">
					<div className="list" onScroll={onScroll}>
						{orderHistory.map((data, i) => (
							<OrdersCard
								activate={(orderID) => {
									setActiveCardID(orderID);
									setActiveCardData(
										orderHistory.find((order) => order._id.toString() === orderID) as TOrder & { _id: string; createdAt: string | Date }
									);
								}}
								active={activeCardID === data._id.toString()}
								data={data}
								history
								key={i}
								showDetails={setSideSheetOpen}
							/>
						))}
					</div>
					<div className="details">
						{activeCardData ? (
							<OrderDetails order={activeCardData} profile={profile} />
						) : (
							<NoContent animationName="GhostNoContent" label="No orders yet" size={200} />
						)}
					</div>
				</div>
			)}
			<SideSheet open={sideSheetOpen} setOpen={setSideSheetOpen} title={["Order Details"]}>
				{activeCardData && <OrderDetails order={activeCardData} profile={profile} />}
			</SideSheet>
		</div>
	);
};

export default OrderHistory;

export interface TOrderHistoryProps {
	onScroll: (event: UIEvent<HTMLDivElement>) => void;
}
