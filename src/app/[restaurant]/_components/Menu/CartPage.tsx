import { useEffect, useState } from 'react';

import clsx from 'clsx';
import { useSearchParams } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { Button, Lottie } from 'xtreme-ui';

import { useOrder } from '#components/context/useContext';
import Collapsible from '#components/layout/Collapsible';
import NoContent from '#components/layout/NoContent';
import { getAnimSrc } from '#utils/constants/common';
import { TMenu } from '#utils/database/models/menu.js';

import ItemCard from '../../../../components/layout/ItemCard';

import CartTaxItem from './CartTaxItem';
import './cartPage.scss';

const CartPage = (props: TCartPageProps) => {
	const { selectedProducts, increaseProductQuantity, decreaseProductQuantity, resetSelectedProducts } = props;
	const params = useSearchParams();
	const table = params.get('table');
	const { order, placeOrder, placingOrder, cancelOrder, cancelingOrder } = useOrder();
	const [showOrderHistory, setShowOrderHistory] = useState(false);
	const [selectionTotal, setSelectionTotal] = useState(0);
	const [bottomBarActive, setBottomBarActive] = useState(false);
	const [showTaxSummary, setShowTaxSummary] = useState(false);

	const approvedProducts = order?.products?.reduce((acc, product) => (product.adminApproved ? acc + 1 : acc), 0);

	const onOrderAction = async () => {
		if (bottomBarActive) {
			setShowTaxSummary(false);
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

	useEffect(() => {
		if (!selectedProducts.length) setShowOrderHistory(true);
		else setShowOrderHistory(false);

		setSelectionTotal(selectedProducts.reduce((total, product) => {
			return total + (product.quantity * product.price);
		}, 0));
	}, [props.selectedProducts, selectedProducts]);

	useEffect(() => {
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

	return (
		<div className='cartPage'>
			<div className='cartItems'>
				{
					order?.products?.length && approvedProducts &&
					<Collapsible className='orderedProducts'
						round
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
						approvedProducts &&
						<div className='orderTotal' onClick={() => {
							setShowTaxSummary(false);
							setBottomBarActive((v) => !v);
						}}
						>
							{
								bottomBarActive
									? <h5>Bill <span>Summary</span></h5>
									: <>
										<p>Sub Total</p>
										<span className='totalValue rupee'>{order?.orderTotal} </span>
										{ order?.orderTotal && <span className='plusTaxes'> + ₹{order?.taxTotal} Tax</span> }
									</>
							}
						</div>
					}
					<div className='cartAction'>
						<Button
							iconType='solid'
							size='mini'
							icon={bottomBarActive ? 'f078' : (props.selectedProducts.length > 0 ? 'e1bc' : 'f09d')}
							label={
								bottomBarActive ? 'close'
									: (
										props.selectedProducts.length > 0 ?
											`${selectionTotal} | ${order?.products?.length ? 'Add to order' : 'Place order'}`
											: 'Proceed to Pay'
									)
							}
							loading={placingOrder}
							onClick={onOrderAction}
						/>
					</div>
				</div>
				{
					order &&
					<div className={clsx('taxDetails', showTaxSummary && 'show')}>
						<CartTaxItem name='Item Total' amount={order?.orderTotal} />
						<hr className='itemHr' />
						<CartTaxItem
							className='taxSummaryTitle'
							name={showTaxSummary ? 'Tax Summary' : 'Tax Total'}
							subtitle={showTaxSummary ? 'collapse' : 'show details'}
							amount={order?.taxTotal}
							onClick={() => setShowTaxSummary((v) => !v)}
						/>
						<div className='taxSummary'>
							{
								order?.products?.map((product, i) => (
									<CartTaxItem
										key={i}
										name={product?.name ?? ''}
										size='mini'
										taxPercent={product?.taxPercent}
										amount={product?.quantity * product?.tax}
									/>
								))
							}
						</div>
						<hr />
						<CartTaxItem
							name='Grand Total'
							amount={order?.orderTotal + order?.taxTotal}
						/>
					</div>
				}
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
