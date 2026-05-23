import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Button, Icon } from "xtreme-ui";

import Collapsible from "#components/layout/Collapsible";
import NoContent from "#components/layout/NoContent";
import type { TMenu } from "#utils/database/models/menu";
import type { TOrder } from "#utils/database/models/order";

import ItemCard from "../../../../components/layout/ItemCard";

import "./orderDetail.scss";

const OrderDetail = (props: TOrderDetailProps) => {
	const { data, actions, busy, reject, setReject, action } = props;
	const queryParams = useSearchParams();
	const subTab = queryParams.get("subTab") ?? "";

	const [showApprovedItems, setShowApprovedItems] = useState(false);

	const { approvedItems, requestedItems } = useMemo(
		() => ({
			approvedItems: data.products.filter(({ adminApproved }) => adminApproved),
			requestedItems: data.products.filter(({ adminApproved }) => !adminApproved),
		}),
		[data.products]
	);

	const OptionButtons = () => {
		if (!actions) return null;

		if (subTab === "active") {
			return (
				<div className="options">
					<Button
						className="reject"
						icon="f00d"
						iconType="solid"
						label={reject ? "No Don't" : "Cancel"}
						onClick={() => {
							setReject({
								_id: reject ? null : data._id.toString(),
								details: true,
							});
						}}
						type="primaryDanger"
					/>
					<Button
						className="accept"
						icon="f00c"
						iconType="solid"
						label={reject ? "Yes do it!" : "Complete"}
						loading={busy}
						onClick={() => action(data._id.toString())}
					/>
				</div>
			);
		}
		return (
			<div className={`options ${busy ? "busy" : ""}`}>
				<Button
					className="reject"
					icon="f00d"
					iconType="solid"
					label={reject ? "No Don't" : "Reject"}
					onClick={() => {
						setReject({
							_id: reject ? null : data._id.toString(),
							details: true,
						});
					}}
					type="primaryDanger"
				/>
				<Button
					className="accept"
					icon="f00c"
					iconType="solid"
					label={reject ? "Yes do it!" : "Accept"}
					loading={busy}
					onClick={() => action(data._id.toString())}
				/>
			</div>
		);
	};

	return (
		<div className={`orderDetail ${reject ? "reject" : ""}`}>
			<div className="header">
				<div className="info">
					<h1 className="table">{reject ? "Are you sure?" : `Table: ${data?.table}`}</h1>
					<div className="name">
						<Icon code="f007" size={16} type="solid" />
						{data?.customer?.fname} {data?.customer?.lname}
					</div>
					<div className="phone">
						<Icon code="f095" size={16} type="solid" />
						{data?.customer?.phone}
					</div>
					{data?.orderTotal && (
						<div className="total">
							<Icon code="e1bc" size={16} type="solid" />
							{data?.orderTotal}
						</div>
					)}
				</div>
				<OptionButtons />
			</div>
			<div className="detailContent">
				{data?.products?.length === 0 ? (
					<NoContent animationName="GhostNoContent" label="No approved orders from this table yet!" />
				) : subTab !== "requests" || !approvedItems.length ? (
					data.products.map((product, key) => <ItemCard item={product as unknown as TMenuCustom} key={key} staticCard />)
				) : (
					<div>
						<Collapsible
							alert={approvedItems?.length}
							className="orderedProducts"
							expand={showApprovedItems}
							label="Approved Products"
							round
							setExpand={setShowApprovedItems}
						>
							{approvedItems.map((product, key) => (
								<ItemCard item={product as unknown as TMenuCustom} key={key} staticCard />
							))}
						</Collapsible>
						{requestedItems.map((product, key) => (
							<ItemCard item={product as unknown as TMenuCustom} key={key} staticCard />
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default OrderDetail;

export type TOrderDetailProps = {
	data: TOrder;
	actions?: boolean;
	action: (id: string) => void;
	busy: boolean;
	reject: boolean;
	setReject: (props: { _id: string | null; details: boolean }) => void;
};
type TMenuCustom = TMenu & { quantity: number };
