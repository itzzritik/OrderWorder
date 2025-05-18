import { useState, useRef, useEffect } from 'react';

import { Button } from 'xtreme-ui';

import './invoice.scss';

const InvoiceBillItem = (props) => {
	return (<div className='invoiceBillItem'>
		<p className='billName'>{props.name + (props.taxPercent ? ` (${props.taxPercent}%)` : '')}</p>
		<p className='billAmount rupee'>{props.amount}</p>
	</div>);
};

const Invoice = (props: TInvoiceProps) => {
	const [taxList, setTaxList] = useState([]);
	const invoiceRef = useRef();
	const [orderList, setOrderList] = useState([]);
	const [subTotal, setSubTotal] = useState(0);
	const [grandTotal, setGrandTotal] = useState(0);

	const downloadPDF = () => {
		invoiceRef.current.save();
	};

	useEffect(() => {
		if (props.order) {
			setOrderList(props.order.products);
			setSubTotal(props.order.total);
			setGrandTotal(props.order.orderTotal);
			setTaxList(props.order.taxes);
		}
	}, [props.order]);

	return (
		<div className='invoiceWrapper'>
			<div className='invoice'>
				<div className='invoiceItems'>
					<h6 className='invoiceItemsHeading'>Your Order Summary</h6>
					<hr />
					<h6 align='left' className='invoiceHeadingDetails'>Invoice Number: <span>{props.order.invoiceNumber}</span></h6>
					<h6 align='left' className='invoiceHeadingDetails'>Customer Name: <span>{props?.order?.customer?.fname} {props?.order?.customer?.lname}</span></h6>
					<hr />
					{
						orderList.map((item, key) => (
							<div className='invoiceItemCard' key={key}>
								<p className='invoiceItemName'>{item.name}</p>
								<div className='invoiceItemPrice'>
									<p className='rupee'>{item.price}<span>✕</span>{item.quantity}</p>
									<p className='rupee'>{item.price * item.quantity}</p>
								</div>
							</div>
						))
					}
				</div>
				<div className='invoiceBill'>
					<InvoiceBillItem name='Sub Total' amount={subTotal} />
					<div className='invoiceTaxes'>
						{
							taxList?.map?.((taxName, key) => {
								return (<InvoiceBillItem key={key} name={taxName.name} taxPercent={taxName.value} amount={taxName.calculatedTax} />);
							})
						}
					</div>
					<InvoiceBillItem name='Grand Total' amount={grandTotal} />
				</div>
				<Button className='invoiceDownload' icon='f354' onClick={downloadPDF} />
			</div>
		</div>
	);
};

export default Invoice;

type TInvoiceProps = {
	order: TOrder
}

type TOrder = {

	// products:
	// total
	// orderTotal
	// taxes
	// invoiceNumber
	// customer
}
