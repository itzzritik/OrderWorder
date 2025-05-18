import React, { useState, useRef, UIEvent } from 'react';

import { toast } from 'react-toastify';
import { Button, Icon, Spinner } from 'xtreme-ui';

import { useAdmin } from '#components/context/useContext';
import { TMenu } from '#utils/database/models/menu';

import MenuEditorItem from './MenuEditorItem';
import './menuEditor.scss';

const MenuEditor = () => {
	const { profile, menus, profileLoading, profileMutate } = useAdmin();
	const [modalState, setModalState] = useState('');
	const [editItem, setEditItem] = useState<TMenu>();
	const [hideSettingsLoading, setHideSettingsLoading] = useState<string[]>([]);
	const [category, setCategory] = useState(0);

	const categories = useRef<HTMLDivElement>(null);

	const [leftCategoryScroll, setLeftCategoryScroll] = useState(false);
	const [rightCategoryScroll, setRightCategoryScroll] = useState(true);

	const onCategoryScroll = (event: UIEvent<HTMLDivElement>) => {
		const target = event.target as HTMLDivElement;
		if (target.scrollLeft > 50) setLeftCategoryScroll(true);
		else setLeftCategoryScroll(false);

		if (Math.round(target.scrollWidth - target.scrollLeft) - 50 > target.clientWidth) setRightCategoryScroll(true);
		else setRightCategoryScroll(false);
	};
	const categoryScrollLeft = () => {
		if (categories?.current)
			categories.current.scrollLeft -= 400;
	};
	const categoryScrollRight = () => {
		if (categories?.current)
			categories.current.scrollLeft += 400;
	};
	const onHide = async (itemId: string, hidden: boolean) => {
		setHideSettingsLoading((v) => ([...v, itemId]));
		const req = await fetch('/api/admin/menu/hidden', {
			method: 'POST',
			body: JSON.stringify({ itemId, hidden }),
		});
		const res = await req.json();

		if (res?.status !== 200) toast.error(res?.message);

		await profileMutate();
		setHideSettingsLoading((v) => v.filter((item) => item !== itemId));
	};
	const onEdit = (item: TMenu) => {
		setEditItem(item);
		setModalState('menuItemEditState');
	};

	if (profileLoading) return <Spinner fullpage label='Loading Menu...' />;

	return (
		<div className='menuEditor'>
			<div className='menuCategoryEditor'>
				<div className='menuCategoryHeader'>
					<h1 className='menuCategoryHeading'>Menu Categories</h1>
					<div className='menuCategoryOptions' />
				</div>
				<div className='menuCategoryContainer' ref={categories} onScroll={onCategoryScroll}>
					{
						profile?.categories?.map((item, i) => (
							<div
								key={i}
								className={`menuCategory ${category === i ? 'active' : ''}`}
								onClick={() => setCategory(i)}
							>
								<span className='title'>{item}</span>
							</div>
						))
					}
					<div className='space' />
				</div>
				<div className={`scrollLeft ${leftCategoryScroll ? 'show' : ''}`} onClick={categoryScrollLeft}>
					<Icon code='f053' type='solid' />
				</div>
				<div className={`scrollRight ${rightCategoryScroll ? 'show' : ''}`} onClick={categoryScrollRight}>
					<Icon code='f054' type='solid' />
				</div>
			</div>
			<div className='menuItemEditor'>
				<div className='menuItemHeader'>
					<h1 className='menuItemHeading'>Menu Items</h1>
					<div className='menuItemOptions' />
				</div>
				<div className='menuItemContainer'>
					{
						menus.map((item, id) => (
							<MenuEditorItem
								key={id}
								item={item}
								onEdit={onEdit}
								onHide={onHide}
								hideSettingsLoading={hideSettingsLoading.includes(item._id.toString())}
							/>
						)) }
				</div>
			</div>
			<Button
				className={`menuEditorAdd ${modalState ? 'active' : ''}`}
				onClick={() => setModalState('newState')}
				icon='2b'
				iconType='solid'
			/>
		</div>
	);
};

export default MenuEditor;
