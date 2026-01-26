import type { MenuSuggestion } from "../../types/chat";

export function MenuCard({ item }: MenuCardProps) {
	const handleClick = () => {
		const el = document.getElementById(`menu-item-${item._id}`);
		if (el) {
			el.scrollIntoView({ behavior: "smooth", block: "center" });
			window.dispatchEvent(new CustomEvent("highlight-item", { detail: { id: String(item._id) } }));
		}
	};

	const vegIcon: Record<MenuSuggestion["veg"], string> = {
		veg: "🟢",
		"non-veg": "🔴",
		"contains-egg": "🟡",
	};

	return (
		<button type="button" onClick={handleClick} className="menu-card">
			<span className="menu-card-image" style={{ backgroundImage: `url(${item.image})` }} />
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

interface MenuCardProps {
	item: MenuSuggestion;
}
