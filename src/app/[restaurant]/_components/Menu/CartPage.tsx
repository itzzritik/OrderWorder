import clsx from "clsx";
import { useSearchParams } from "next/navigation";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button, Lottie } from "xtreme-ui";

import { useOrder } from "#components/context/useContext";
import Collapsible from "#components/layout/Collapsible";
import NoContent from "#components/layout/NoContent";
import { getAnimSrc } from "#utils/constants/common";
import type { TMenu } from "#utils/database/models/menu.js";

import ItemCard from "../../../../components/layout/ItemCard";

import CartTaxItem from "./CartTaxItem";
import "./cartPage.scss";

const CartPage = (props: TCartPageProps) => {
	const { selectedProducts, increaseProductQuantity, decreaseProductQuantity, resetSelectedProducts } = props;
	const params = useSearchParams();
	const table = params.get("table");
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
		if (selectedProducts.length) setShowOrderHistory(false);
		else setShowOrderHistory(true);

		setSelectionTotal(selectedProducts.reduce((total, product) => total + product.quantity * product.price, 0));
	}, [selectedProducts]);

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

	if (!(props.selectedProducts.length || order?.products?.length)) {
		return (
			<div className="cartPage">
				<NoContent animationName="FoodBurgerHappy" label={"Aren't you hungry?"} />
			</div>
		);
	}

	if (order?.products?.length && approvedProducts === 0) {
		return (
			<div className="cartPage">
				<div className="cartApproval">
					<Lottie className="burgerLoader" size={250} src={getAnimSrc("FoodCook")} />
					<div className="approvalHeading">
						<p>Your order</p>
						<p>will be accepted soon</p>
					</div>
					<Button className="endOrder" label="Cancel Order" loading={cancelingOrder} onClick={onCancelOrder} size="mini" type="secondaryDanger" />
				</div>
			</div>
		);
	}

	return (
		<div className="cartPage">
			<div className="cartItems">
				{order?.products?.length && approvedProducts && (
					<Collapsible
						alert={order?.products?.length}
						className="orderedProducts"
						expand={showOrderHistory}
						label="Order History"
						round
						setExpand={setShowOrderHistory}
					>
						{order?.products.map((product, key) => (
							<ItemCard item={product as unknown as TMenuCustom} key={key} staticCard />
						))}
					</Collapsible>
				)}
				<div className="selectedProducts">
					{selectedProducts.map((product, key) => (
						<ItemCard decreaseQuantity={decreaseProductQuantity} increaseQuantity={increaseProductQuantity} item={product} key={key} />
					))}
				</div>
			</div>
			<div className={`cartCheckout ${bottomBarActive ? "active" : ""}`}>
				<div className="checkoutHeader">
					{approvedProducts && (
						<div
							className="orderTotal"
							onClick={() => {
								setShowTaxSummary(false);
								setBottomBarActive((v) => !v);
							}}
						>
							{bottomBarActive ? (
								<h5>
									Bill <span>Summary</span>
								</h5>
							) : (
								<>
									<p>Sub Total</p>
									<span className="totalValue rupee">{order?.orderTotal} </span>
									{order?.orderTotal && <span className="plusTaxes"> + ₹{order?.taxTotal} Tax</span>}
								</>
							)}
						</div>
					)}
					<div className="cartAction">
						<Button
							icon={bottomBarActive ? "f078" : props.selectedProducts.length > 0 ? "e1bc" : "f09d"}
							iconType="solid"
							label={
								bottomBarActive
									? "close"
									: props.selectedProducts.length > 0
										? `${selectionTotal} | ${order?.products?.length ? "Add to order" : "Place order"}`
										: "Proceed to Pay"
							}
							loading={placingOrder}
							onClick={onOrderAction}
							size="mini"
						/>
					</div>
				</div>
				{order && (
					<div className={clsx("taxDetails", showTaxSummary && "show")}>
						<CartTaxItem amount={order?.orderTotal} name="Item Total" />
						<hr className="itemHr" />
						<CartTaxItem
							amount={order?.taxTotal}
							className="taxSummaryTitle"
							name={showTaxSummary ? "Tax Summary" : "Tax Total"}
							onClick={() => setShowTaxSummary((v) => !v)}
							subtitle={showTaxSummary ? "collapse" : "show details"}
						/>
						<div className="taxSummary">
							{order?.products?.map((product, i) => (
								<CartTaxItem amount={product?.quantity * product?.tax} key={i} name={product?.name ?? ""} size="mini" taxPercent={product?.taxPercent} />
							))}
						</div>
						<hr />
						<CartTaxItem amount={order?.orderTotal + order?.taxTotal} name="Grand Total" />
					</div>
				)}
			</div>
		</div>
	);
};

export default CartPage;

interface TCartPageProps {
	decreaseProductQuantity: (product: TMenuCustom) => void;
	increaseProductQuantity: (product: TMenuCustom) => void;
	resetSelectedProducts: () => void;
	selectedProducts: TMenuCustom[];
	setSideSheetHeading: (heading: [string, string]) => void;
}

type TMenuCustom = TMenu & { quantity: number };
