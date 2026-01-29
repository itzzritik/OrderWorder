"use client";

import { usePDF } from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import { Button } from "xtreme-ui";

import { InvoiceDocument, type TInvoiceProps } from "#components/layout/Invoice";

import "./orderDetails.scss";

const OrderDetails = ({ order, profile }: TInvoiceProps) => {
	const [isClient, setIsClient] = useState(false);
	const [instance, updateInstance] = usePDF({ document: <InvoiceDocument order={order} profile={profile} /> });

	useEffect(() => {
		setIsClient(true);
	}, []);

	useEffect(() => {
		updateInstance(<InvoiceDocument order={order} profile={profile} />);
	}, [order, profile, updateInstance]);

	const handleDownload = () => {
		if (instance.url) {
			const link = document.createElement("a");
			link.href = instance.url;
			link.download = `Invoice-${order._id.toString().slice(-6).toUpperCase()}.pdf`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
	};

	const handlePrint = () => {
		if (instance.url) {
			const iframe = document.createElement("iframe");
			iframe.style.display = "none";
			iframe.src = instance.url;
			document.body.appendChild(iframe);
			iframe.contentWindow?.focus();
			iframe.contentWindow?.print();
		}
	};

	if (!isClient) return null;

	return (
		<div className="orderDetailsPreview">
			<div className="header">
				<div className="title">
					<h2>Order Details</h2>
					<div className="orderId">
						Invoice <span>#{order._id.toString().slice(-6).toUpperCase()}</span>
					</div>
				</div>
				<div className="actions">
					<Button icon="f019" type="primary" className="actionBtn" onClick={handleDownload} disabled={instance.loading || !instance.url} />
					<Button icon="f02f" type="secondary" className="actionBtn" onClick={handlePrint} disabled={instance.loading || !instance.url} />
				</div>
			</div>

			<div className="contentScroll">
				<div className="section customerInfo">
					<div className="infoBlock">
						<span className="label">Date</span>
						<span>{new Date(order.createdAt || Date.now()).toLocaleDateString()}</span>
					</div>
					<div className="infoBlock">
						<span className="label">Table</span>
						<span>{order.table}</span>
					</div>
					{order.customer && (
						<>
							<div className="infoBlock">
								<span className="label">Customer</span>
								<span>
									{order.customer.fname} {order.customer.lname}
								</span>
							</div>
							<div className="infoBlock">
								<span className="label">Contact</span>
								<span>{order.customer.phone}</span>
							</div>
						</>
					)}
				</div>

				<div className="section itemsList">
					<h3>Items</h3>
					<div className="table">
						<div className="row headerRow">
							<span className="col name">Item</span>
							<span className="col qty">Qty</span>
							<span className="col price">Price</span>
							<span className="col total">Total</span>
						</div>
						{order.products?.map((item, index) => (
							<div key={index} className="row">
								<span className="col name">{item.name}</span>
								<span className="col qty">x{item.quantity}</span>
								<span className="col price">{item.price?.toFixed(2)}</span>
								<span className="col total">{(item.price * item.quantity).toFixed(2)}</span>
							</div>
						))}
					</div>
				</div>

				<div className="section summary">
					<div className="summaryRow">
						<span>Subtotal</span>
						<span>{order.orderTotal?.toFixed(2)}</span>
					</div>
					<div className="summaryRow">
						<span>Tax</span>
						<span>{order.taxTotal?.toFixed(2)}</span>
					</div>
					<div className="summaryRow grandTotal">
						<span>Grand Total</span>
						<span>{((order.orderTotal || 0) + (order.taxTotal || 0)).toFixed(2)}</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default OrderDetails;
