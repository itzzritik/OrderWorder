import clsx from "clsx";
import { useSearchParams } from "next/navigation";
import { Button } from "xtreme-ui";

import type { TOrder } from "#utils/database/models/order";

import "./ordersCard.scss";

const OrdersCard = (props: TOrdersCard) => {
	const { data, actions, active, reject, setReject, busy, history, details, action, activate, showDetails } = props;
	const queryParams = useSearchParams();
	const subTab = queryParams.get("subTab") ?? "";

	const tableName = data.table;
	const customerName = `${data?.customer?.fname} ${data?.customer?.lname}`;

	const OptionButtons = () => {
		if (!actions) return null;

		if (subTab === "active") {
			return (
				<div className="options">
					<Button
						className="accept"
						icon="f00c"
						iconType="solid"
						label={props.reject ? "Yes do it!" : "Complete"}
						loading={busy}
						onClick={() => action?.(data._id.toString())}
						size="mini"
					/>
					{!busy && (
						<Button
							className="reject"
							icon="f00d"
							iconType="solid"
							label={reject ? "No Don't" : "Cancel"}
							onClick={() => {
								setReject?.({
									_id: reject ? null : data._id.toString(),
									details: false,
								});
							}}
							size="mini"
							type="primaryDanger"
						/>
					)}
				</div>
			);
		}
		return (
			<div className="options">
				<Button
					className="accept"
					icon="f00c"
					iconType="solid"
					label={reject ? "Yes do it!" : "Accept"}
					loading={busy}
					onClick={() => action?.(data._id.toString())}
					size="mini"
				/>
				{!busy && (
					<Button
						className="reject"
						icon="f00d"
						iconType="solid"
						label={reject ? "No Don't" : "Reject"}
						onClick={() => {
							setReject?.({
								_id: reject ? null : data._id.toString(),
								details: false,
							});
						}}
						size="mini"
						type="primaryDanger"
					/>
				)}
			</div>
		);
	};

	const classList = clsx("ordersCard", active && "active", reject && "reject", busy && "busy");

	return (
		<div
			className={classList}
			onClick={() => {
				!(active || history) && setReject?.({ _id: null, details: false });
				activate(data._id.toString());
			}}
		>
			<div className="content">
				<p className="table">{!reject || details ? `Table: ${tableName}` : "Are you sure?"}</p>
				<p className="name">{!reject || details ? customerName : `Table: ${tableName}`}</p>
				{data?.products?.length ? (
					<p className="total rupee" onClick={() => showDetails?.(true)}>
						{data?.orderTotal}
					</p>
				) : (
					<p className="noContent">No orders yet</p>
				)}
				<OptionButtons />
			</div>
		</div>
	);
};

export default OrdersCard;

type TOrdersCard = {
	data: TOrder;
	actions?: boolean;
	history?: boolean;
	active?: boolean;
	reject?: boolean;
	setReject?: (props: { _id: string | null; details: boolean }) => void;
	busy?: boolean;
	details?: boolean;
	action?: (id: string) => void;
	showDetails?: (value: boolean) => void;
	activate: (id: string) => void;
};
