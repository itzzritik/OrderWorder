import { useInView } from "react-intersection-observer";
import { Button, Icon, useScreenType } from "xtreme-ui";

import { VEG_ICON_CODE } from "#utils/constants/common";
import type { TMenu } from "#utils/database/models/menu";

import "./menuEditorItem.scss";

const MenuEditorItem = (props: TMenuEditorItemProps) => {
	const { item, onEdit, onHide, hideSettingsLoading = false } = props;
	const { isMobile } = useScreenType();
	const [itemRef, inView] = useInView({ threshold: 0 });

	return (
		<div className="menuEditorItem" ref={itemRef}>
			{inView && (
				<>
					<div className="menuItemPicture">
						{item.image ? <span className="image" style={{ background: `url(${item.image})` }} /> : <Icon code="e43b" />}
						{item.veg && (
							<div className={`vegIcon ${item.veg}`}>
								<Icon className="icon" code={VEG_ICON_CODE[item.veg]} size={16} type="solid" />
								<span className="label">{item.veg.replace(/-/g, " ")}</span>
							</div>
						)}
					</div>
					<div className="menuItemData">
						<h5 className="menuItemTitle">{item.name}</h5>
						<p className="menuItemDesc">{item.description}</p>
						<p className="menuItemPrice rupee">{item.price}</p>
					</div>
					<div className="menuItemOptions">
						<Button
							icon={item.hidden ? "f070" : "f06e"}
							iconType="solid"
							label={isMobile ? undefined : item.hidden ? "Hidden" : "Visible"}
							loading={hideSettingsLoading}
							onClick={() => onHide(item._id.toString(), !item.hidden)}
							size="mini"
							type={item.hidden ? "secondary" : "primary"}
						/>
						<Button icon="f304" iconType="solid" onClick={() => onEdit(item)} size="mini" type="primary" />
					</div>
				</>
			)}
		</div>
	);
};

export default MenuEditorItem;

type TMenuEditorItemProps = {
	item: TMenu;
	onEdit: (item: TMenu) => void;
	onHide: (id: string, hidden: boolean) => void;
	hideSettingsLoading: boolean;
};
