import Image from "next/image";
import type { MenuSuggestion } from "../../types/chat";

interface MenuCardProps {
	item: MenuSuggestion;
	restaurantId: string;
}

export function MenuCard({ item, restaurantId }: MenuCardProps) {
	const handleClick = () => {
		const targetUrl = `/${restaurantId}?highlight=${item._id}`;
		window.location.href = targetUrl;
	};

	const vegIcon: Record<MenuSuggestion["veg"], string> = {
		veg: "🟢",
		"non-veg": "🔴",
		"contains-egg": "🟡",
	};

	return (
		<button type="button" onClick={handleClick} className="menu-card">
			<Image src={item.image} alt={item.name} width={64} height={64} className="menu-card-image" />
			<div className="menu-card-content">
				<div className="menu-card-header">
					<h4>{item.name}</h4>
					<span className="veg-indicator">{vegIcon[item.veg]}</span>
				</div>
				<p className="menu-card-price">₹{item.price}</p>
			</div>
		</button>
	);
}
