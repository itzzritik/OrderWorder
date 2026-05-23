import { type UIEvent, useEffect, useState } from "react";

import SideSheet from "#components/base/SideSheet";
import { useAdmin } from "#components/context/useContext";
import NoContent from "#components/layout/NoContent";
import type { TMenu } from "#utils/database/models/menu";
import type { TOrder } from "#utils/database/models/order";

import ItemCard from "../../../../components/layout/ItemCard";

import OrderDetail from "./OrderDetail";
import OrdersCard from "./OrdersCard";

const OrderRequests = (props: TOrderRequestsProps) => {
	const { onScroll } = props;
	const { orderRequest = [], orderAction, orderActionLoading } = useAdmin();
	const [activeCardID, setActiveCardID] = useState<string>();
	const [activeCardData, setActiveCardData] = useState<TOrder>();
	const [rejectCard, setRejectCard] = useState<{ _id: string | null; details: boolean }>({ _id: null, details: false });
	const [sideSheetOpen, setSideSheetOpen] = useState(false);

	const onOrderAction = async (orderID: string) => {
		if (orderID === rejectCard._id) return await orderAction(orderID, "reject");

		return await orderAction(orderID, "accept");
	};

	useEffect(() => {
		if (orderRequest.length === 0) {
			setActiveCardID(undefined);
			setActiveCardData(undefined);
		} else if (!orderRequest.some(({ _id }) => _id.toString() === activeCardID)) {
			setActiveCardID(orderRequest[0]?._id.toString());
			setActiveCardData(orderRequest[0]);
		}
	}, [activeCardID, orderRequest]);

	return (
		<div className="orders">
			{orderRequest?.length === 0 ? (
				<NoContent animationName="GhostNoContent" label="No order requests" />
			) : (
				<div className="ordersContent">
					<div className={`list ${orderActionLoading ? "disable" : ""}`} onScroll={onScroll}>
						{orderRequest?.map?.((data, i) => (
							<OrdersCard
								action={onOrderAction}
								actions
								activate={(orderID: string) => {
									setActiveCardID(orderID);
									setActiveCardData(orderRequest.find((order) => order._id.toString() === orderID));
								}}
								active={activeCardID === data._id.toString()}
								busy={orderActionLoading}
								data={data}
								details={!!rejectCard?._id && rejectCard.details}
								key={i}
								reject={rejectCard._id === data._id.toString()}
								setReject={setRejectCard}
								showDetails={setSideSheetOpen}
							/>
						))}
					</div>
					<div className={`details ${activeCardData && rejectCard._id === activeCardData._id.toString() ? "reject" : ""}`}>
						{activeCardData ? (
							<OrderDetail
								action={onOrderAction}
								actions
								busy={orderActionLoading}
								data={activeCardData}
								reject={activeCardData && rejectCard._id === activeCardData._id.toString()}
								setReject={setRejectCard}
							/>
						) : (
							<NoContent animationName="GhostNoContent" label="Nothing to show" size={200} />
						)}
					</div>
				</div>
			)}
			<SideSheet open={sideSheetOpen} setOpen={setSideSheetOpen} title={[activeCardData ? `Table: ${activeCardData?.table}` : ""]}>
				{activeCardData?.products.map((product, key) => (
					<ItemCard item={product as unknown as TMenuCustom} key={key} staticCard />
				))}
			</SideSheet>
		</div>
	);
};

export default OrderRequests;

export type TOrderRequestsProps = {
	onScroll: (event: UIEvent<HTMLDivElement>) => void;
};
type TMenuCustom = TMenu & { quantity: number };
