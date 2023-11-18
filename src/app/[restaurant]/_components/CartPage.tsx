import React, { useEffect, useState } from 'react';

// import Collapsible from '#components/base/Collapsible';
import { useSearchParams } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { Button, Icon, Lottie } from 'xtreme-ui';

import { useOrder } from '#components/context/useContext';
import Collapsible from '#components/layout/Collapsible';
import NoContent from '#components/layout/NoContent';
import { getAnimSrc } from '#utils/constants/common';
import { TMenu } from '#utils/database/models/menu.js';

import ItemCard from '../../../components/layout/ItemCard';

import './cartPage.scss';

const CartPage = (props: TCartPageProps) => {
	const { selectedProducts, increaseProductQuantity, decreaseProductQuantity, resetSelectedProducts, setSideSheetHeading } = props;
	const params = useSearchParams();
	const table = params.get('table');
	const { order, placeOrder, placingOrder, cancelOrder, cancelingOrder } = useOrder();
	const [showOrderHistory, setShowOrderHistory] = useState(false);
	const [selectionTotal, setSelectionTotal] = useState(0);
	const [bottomBarActive, setBottomBarActive] = useState(false);

	const approvedProducts = order?.products?.reduce((acc, product) => (product.adminApproved ? acc + 1 : acc), 0);

	const onOrderAction = async () => {
		if (bottomBarActive) {
			return setBottomBarActive(false);
		}

		if (props.selectedProducts.length === 0) {
			// return endOrder();
		}

		await placeOrder(selectedProducts);
		resetSelectedProducts();
	};
	const onCancelOrder = async () => {
		await cancelOrder();
		resetSelectedProducts();
	};

	// const calculateTax = (taxItem) => {
	// 	let amount = 0;
	// 	if (order.gstInclusive) {
	// 		amount = orderTotal - orderTotal * (1 / (1 + (taxItem.value / 100)));
	// 		amount = parseFloat(amount).toFixed(2);
	// 	} else {
	// 		amount = orderTotal * (taxItem.value / 100);
	// 		amount = parseFloat(amount).toFixed(2);
	// 	}
	// 	return amount;
	// };

	useEffect(() => {
		if (!selectedProducts.length) setShowOrderHistory(true);
		else setShowOrderHistory(false);

		setSelectionTotal(selectedProducts.reduce((total, product) => {
			return total + (product.quantity * product.price);
		}, 0));
	}, [props.selectedProducts, selectedProducts]);

	useEffect(() => {
		console.log(order, table);

		const cancelAndSignout = async () => {
			await cancelOrder();
			signOut();
		};

		if (order?.table && order?.table !== table) cancelAndSignout();
	}, [cancelOrder, order, table]);

	// useEffect(() => {
	// 	if (userOrderEnd) {
	// 		setSideSheetHeading(['Order', 'Invoice']);
	// 	}
	// }, [userOrderEnd, setSideSheetHeading]);

	if (!props.selectedProducts.length && !order?.products?.length) {
		return (
			<div className='cartPage'>
				<NoContent label={'Aren\'t you hungry?'} animationName='FoodBurgerHappy' />
			</div>
		);
	}

	if (order?.products?.length && approvedProducts === 0) {
		return (
			<div className='cartPage'>
				<div className='cartApproval'>
					<Lottie className='burgerLoader' src={getAnimSrc('FoodCook')} size={250} />
					<div className='approvalHeading'>
						<p>Your order</p>
						<p>will be accepted soon</p>
					</div>
					<Button
						className='endOrder'
						type='secondaryDanger'
						size='mini'
						label='Cancel Order'
						loading={cancelingOrder}
						onClick={onCancelOrder}
					/>
				</div>
			</div>
		);
	}

	// if (userOrderEnd) {
	// 	return <Invoice order={order} />;
	// }

	return (
		<div className='cartPage'>
			<div className='cartItems'>
				{
					order?.products?.length && approvedProducts &&
					<Collapsible className='orderedProducts'
						label='Order History'
						expand={showOrderHistory}
						setExpand={setShowOrderHistory}
						alert={order?.products?.length}
					>
						{
							order?.products.map((product, key) => {
								return <ItemCard key={key} item={product as unknown as TMenuCustom} staticCard />;
							})
						}
					</Collapsible>
				}
				<div className='selectedProducts'>
					{
						selectedProducts.map((product, key) => {
							return (
								<ItemCard
									item={product}
									key={key}
									increaseQuantity={increaseProductQuantity}
									decreaseQuantity={decreaseProductQuantity}
								/>
							);
						})
					}
				</div>
			</div>
			<div className={`cartCheckout ${bottomBarActive ? 'active' : ''}`}>
				<div className='checkoutHeader'>
					{
						approvedProducts
						&& <div className='orderTotal' onClick={() => setBottomBarActive((value) => !value)}>
							{
								bottomBarActive
									? <h5>Amount <span>Details</span></h5>
									: <>
										<p>Sub Total</p>
										<span className='totalValue rupee'>{order?.orderTotal} </span>
										{/* { order && !order.gstInclusive && orderTotal > 0 && <span className='plusTaxes'>plus taxes</span> }
										{ order && order.gstInclusive && orderTotal > 0 && <span className='plusTaxes'>including taxes</span> } */}
									</>
							}
						</div>
					}
					<div className='cartAction'>
						{
							<div className='orderActionButton round' onClick={onOrderAction}>
								{ bottomBarActive && <Icon code='f078' /> }
								{
									!bottomBarActive && (
										props.selectedProducts.length > 0
											? <>
												<p className='selectionTotal rupee'>{selectionTotal}</p>
												<p className='separator'>|</p>
												<p className='orderActionLabel'>
													Place order
													{/* {orderedProducts.length ? 'Add to order' : 'Place order'} */}
												</p>
											</>
											: <p>Proceed to Pay</p>
									)
								}
							</div>
						}
					</div>
				</div>
				<div className='taxDetails'>
					{/* <CartTaxItem name='Sub Total' amount={orderTotal} />
					{
						taxList.map((taxName, key) => {
							return (<CartTaxItem key={key} name={taxName.name} taxPercent={taxName.value}
								amount={calculateTax(taxName)}
							        />);
						})
					}
					<hr />
					<CartTaxItem
						name='Grand Total'
						amount={order && order.gstInclusive ? orderTotal : Math.round(parseFloat(orderTotal) + parseFloat(totalTax))}
					/> */}
				</div>
			</div>
		</div>
	);
};

export default CartPage;

type TCartPageProps = {
	selectedProducts: Array<TMenuCustom>
	increaseProductQuantity: (product: TMenuCustom) => void
	decreaseProductQuantity: (product: TMenuCustom) => void
	resetSelectedProducts: () => void
	setSideSheetHeading: (heading: [string, string]) => void
}

type TMenuCustom = TMenu & {quantity: number}
