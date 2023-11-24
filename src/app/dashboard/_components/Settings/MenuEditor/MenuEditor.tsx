import React, { useState, useRef } from 'react';

import { Icon } from 'xtreme-ui';

import { useAdmin } from '#components/context/useContext';

import MenuEditorItem from './MenuEditorItem';
import MenuEditorModal from './MenuEditorModal';
import './menuEditor.scss';

const MenuEditor = () => {
	const { profile, menus } = useAdmin();
	const [modalState, setModalState] = useState('');
	const [editItem, setEditItem] = useState();
	const [category, setCategory] = useState(0);

	const categories = useRef<HTMLDivElement>(null);

	const [leftCategoryScroll, setLeftCategoryScroll] = useState(false);
	const [rightCategoryScroll, setRightCategoryScroll] = useState(true);

	const onCategoryClicked = (key) => {
		setCategory(key);
	};
	const onCategoryScroll = (event) => {
		if (event.target.scrollLeft > 50) {
			setLeftCategoryScroll(true);
		} else {
			setLeftCategoryScroll(false);
		}

		if (Math.round(event.target.scrollWidth - event.target.scrollLeft) - 50 > event.target.clientWidth) {
			setRightCategoryScroll(true);
		} else {
			setRightCategoryScroll(false);
		}
	};
	const categoryScrollLeft = () => {
		if (categories?.current)
			categories.current.scrollLeft -= 400;
	};
	const categoryScrollRight = () => {
		if (categories?.current)
			categories.current.scrollLeft += 400;
	};
	const onHide = (itemID) => {

	};
	const onEdit = (item) => {
		setEditItem(item);
		setModalState('menuItemEditState');
	};
	console.log(menus);
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
								onClick={() => onCategoryClicked(i)}
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
					{ menus.map((item, key) => <MenuEditorItem key={key} item={item} onEdit={onEdit} onHide={onHide} />) }
				</div>
			</div>
			<div className={`menuEditorAdd ${modalState ? 'active' : ''}`}
				onClick={() => setModalState('newState')}
			>
				<Icon code='2b' type='solid' />
				<span className='label'>New</span>
			</div>
			{/* <MenuEditorModal
				state={modalState}
				setState={setModalState}
				restaurantID={profile?.restaurantID}
				categoryList={profile?.categories}
				editItem={editItem}
				setEditItem={setEditItem}
			/> */}
		</div>
	);
};

export default MenuEditor;
