import clsx from "clsx";
import { useInView } from "react-intersection-observer";

import QuantityButton from "#components/base/QuantityButton";
import type { TMenu } from "#utils/database/models/menu";

import "./itemCard.scss";

const ItemCard = (props: TItemCardProps) => {
	const { className, item, staticCard, increaseQuantity, decreaseQuantity } = props;
	const [cardRef, inView] = useInView({ triggerOnce: true, threshold: 0 });
	const getTotalPrice = () => (item.quantity ? item.price * item.quantity : item.price);

	const classList = clsx("itemCard", className, staticCard && "staticCard");

	return (
		<div className={classList} ref={cardRef}>
			{inView && (
				<>
					{item.image && (
						<div className="picture">
							<span style={{ background: `url(${item.image})` }} />
						</div>
					)}
					<div className="options">
						<p className="title">{item.name}</p>
						<div className="footer">
							<div className="price">
								{!staticCard && <p className="rupee">{getTotalPrice()}</p>}
								{staticCard && (
									<p className="rupee">
										{item.price} <span>✕</span> {item.quantity}
									</p>
								)}
							</div>
							{staticCard ? (
								<div className="totalAmount rupee">{getTotalPrice()}</div>
							) : (
								<QuantityButton
									className="addToCart"
									decreaseQuantity={() => decreaseQuantity?.(item)}
									increaseQuantity={() => increaseQuantity?.(item)}
									quantity={item.quantity}
								/>
							)}
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default ItemCard;

type TItemCardProps = {
	className?: string;
	item: TMenuCustom;
	staticCard?: boolean;
	increaseQuantity?: (item: TMenuCustom) => void;
	decreaseQuantity?: (item: TMenuCustom) => void;
};

type TMenuCustom = TMenu & { quantity: number };
