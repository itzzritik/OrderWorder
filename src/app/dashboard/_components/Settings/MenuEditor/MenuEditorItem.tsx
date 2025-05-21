import React from 'react';

import { useInView } from 'react-intersection-observer';
import { Button, Icon, useScreenType } from 'xtreme-ui';

import { TMenu } from '#utils/database/models/menu';

import './menuEditorItem.scss';

const vegIcon = {
	'veg': 'f4d8',
	'non-veg': 'f6d6',
	'contains-egg': 'f7fb',
} as const;

const MenuEditorItem = (props: TMenuEditorItemProps) => {
	const { item, onEdit, onHide, hideSettingsLoading = false } = props;
	const { isMobile } = useScreenType();
	const [itemRef, inView] = useInView({ threshold: 0 });

	return (
		<div className='menuEditorItem' ref={itemRef}>
			{
				inView
				&& <>
					<div className='menuItemPicture'>
						{
							!item.image
								? <Icon code='e43b' />
								: <span className='image' style={{ background: `url(${item.image})` }} />
						}
						{
							item.veg &&
							<div className={`vegIcon ${item.veg}`}>
								<Icon className='icon' type='duotone' size={16} code={vegIcon[item.veg]} />
								<span className='label'>{item.veg.replace(/-/g, ' ')}</span>
							</div>
						}
					</div>
					<div className='menuItemData'>
						<h5 className='menuItemTitle'>{item.name}</h5>
						<p className='menuItemDesc'>{item.description}</p>
						<p className='menuItemPrice rupee'>{item.price}</p>
					</div>
					<div className='menuItemOptions'>
						<Button
							icon={item.hidden ? 'f070' : 'f06e'}
							iconType='solid'
							size='mini'
							type={item.hidden ? 'secondary' : 'primary'}
							label={isMobile ? undefined : item.hidden ? 'Hidden' : 'Visible'}
							loading={hideSettingsLoading}
							onClick={() => onHide(item._id.toString(), !item.hidden)}
						/>
						<Button icon='f304' iconType='solid' size='mini' type='primary' onClick={() => onEdit(item)} />
					</div>
				</>
			}
		</div>
	);
};

export default MenuEditorItem;

type TMenuEditorItemProps = {
	item: TMenu,
	onEdit: (item: TMenu) => void,
	onHide: (id: string, hidden: boolean) => void
	hideSettingsLoading: boolean,
}
