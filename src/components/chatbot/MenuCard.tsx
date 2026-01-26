import { Icon } from "xtreme-ui";
import type { MenuSuggestion } from "../../types/chat";

export function MenuCard({ item }: MenuCardProps) {
	const handleClick = () => {
		const el = document.getElementById(`menu-item-${item._id}`);
		if (el) {
			el.scrollIntoView({ behavior: "smooth", block: "center" });
			window.dispatchEvent(new CustomEvent("highlight-item", { detail: { id: String(item._id) } }));
		}
	};

	const vegIconCode = {
		veg: "f4d8",
		"non-veg": "f6d6",
		"contains-egg": "f7fb",
	} as const;

	return (
		<button type="button" onClick={handleClick} className="chatbot-menu-card">
			{item.image && <div className="card-image" style={{ backgroundImage: `url(${item.image})` }} />}
			<div className="card-content">
				<div className="card-header">
					<h4 className="card-title">{item.name}</h4>
					{item.veg && (
						<div className={`veg-badge ${item.veg}`}>
							<Icon code={vegIconCode[item.veg]} type="solid" size={14} />
						</div>
					)}
				</div>
				<p className="card-price">₹{item.price}</p>
			</div>
		</button>
	);
}

interface MenuCardProps {
	item: MenuSuggestion;
}
