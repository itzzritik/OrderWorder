import { Icon } from "xtreme-ui";
import type { MenuSuggestion } from "../../types/chat";
import { VEG_ICON_CODE } from "../../utils/constants/common";
import "./menuCard.scss";

export function MenuCard({ item }: MenuCardProps) {
	const handleClick = () => {
		const el = document.getElementById(`menu-item-${item._id}`);
		if (el) {
			el.scrollIntoView({ behavior: "smooth", block: "center" });
			window.dispatchEvent(new CustomEvent("highlight-item", { detail: { id: String(item._id) } }));
		}
	};

	return (
		<button type="button" onClick={handleClick} className="chatbotMenuCard">
			{item.image && <div className="cardImage" style={{ backgroundImage: `url(${item.image})` }} />}
			<div className="cardDesc">
				<h4 className="cardTitle">{item.name}</h4>
				<p className="cardSubtitle">
					{item.veg && <Icon className={`vegBadge ${item.veg}`} code={VEG_ICON_CODE[item.veg]} type="solid" size={12} />}
					{item.veg && <span className="separator">•</span>}
					<span>₹{item.price}</span>
				</p>
			</div>
		</button>
	);
}

interface MenuCardProps {
	item: MenuSuggestion;
}
