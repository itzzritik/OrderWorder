import React, { useEffect, useRef, useState } from 'react';

import { useSession } from 'next-auth/react';
import { Button, Icon } from 'xtreme-ui';

import Modal from '#components/base/Modal';
import SearchButton from '#components/base/SearchButton';
import SideSheet from '#components/base/SideSheet';
import { useRestaurant } from '#components/context/useContext';
import { useQueryParams } from '#utils/hooks/useQueryParams';

import './menuCategory.scss';
import './orderPage.scss';

const OrderPage = () => {
	const session = useSession();
	const { restaurant, fetchMenu } = useRestaurant();
	const params = useQueryParams();
	const categories = useRef<HTMLDivElement>(null);
	const [loginOpen, setLoginOpen] = useState(false);
	const [sideSheetOpen, setSideSheetOpen] = useState(false);
	const [topHeading, setTopHeading] = useState(['Menu', 'Category']);
	const [orderHeading, setOrderHeading] = useState(['Explore', 'Menu']);
	const [sideSheetHeading, setSideSheetHeading] = useState(['Your', 'Order']);

	const [searchActive, setSearchActive] = useState(false);
	const [searchValue, setSearchValue] = useState('');
	const [floatHeader, setFloatHeader] = useState(false);

	const [leftCategoryScroll, setLeftCategoryScroll] = useState(false);
	const [rightCategoryScroll, setRightCategoryScroll] = useState(true);

	const [category, setCategory] = useState(0);

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
		if (categories.current)
			categories.current.scrollLeft -= 400;
	};
	const categoryScrollRight = () => {
		if (categories.current)
			categories.current.scrollLeft += 400;
	};
	const onLoginClick = () => {
		if (params.get('table')) {
			return setLoginOpen(true);
		}

		return params.router.push('/scan');
	};

	useEffect(() => {
		fetchMenu();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className='orderPage'>
			<div className='mainContainer'>
				<div className={`mainHeader ${searchActive ? 'searchActive' : ''} ${floatHeader ? 'floatHeader' : ''}`}>
					<h1>{topHeading[0]} <span>{topHeading[1]}</span></h1>
					<div className='options'>
						<SearchButton setSearchActive={setSearchActive} placeholder='Search for food' value={searchValue} setValue={setSearchValue} />
						{
							session.data?.role === 'customer'
								? <Button className='loginButton' label={params.get('table') ? 'Order' : 'Scan'} onClick={onLoginClick} />
								: <Button icon='e43b' label='2' onClick={() => setSideSheetOpen(true)} />
						}
						{
							session.data?.role === 'admin'
								&& <Button className='dashboardButton' label='Dashboard' onClick={() => params.router.push('/dashboard')} />
						}
						{
							session.data?.role === 'kitchen'
								&& <Button className='kitchenButton' label='Kitchen' onClick={() => params.router.push('/kitchen')} />
						}
					</div>
				</div>
				<div className={`category ${searchValue ? 'disable' : ''}`}>
					<div className='itemCategories' ref={categories} onScroll={onCategoryScroll}>
						{
							restaurant?.profile?.categories?.map((item, key) => (
								<div key={key} className={`menuCategory ${category === key ? 'active' : ''}`} onClick={() => setCategory(key)}>
									<span className='title'>{item}</span>
								</div>
							))
						}
						<div className='space' />
					</div>
					<div className={`scrollLeft ${leftCategoryScroll ? 'show' : ''}`} onClick={categoryScrollLeft}>
						<Icon code='f053' />
					</div>
					<div className={`scrollRight ${rightCategoryScroll ? 'show' : ''}`} onClick={categoryScrollRight}>
						<Icon code='f054' />
					</div>
				</div>
			</div>
			<SideSheet title={sideSheetHeading} open={sideSheetOpen} setOpen={setSideSheetOpen}>
				{/* <CartPage
					selectedProducts={selectedProducts}
					increaseProductQuantity={increaseProductQuantity}
					decreaseProductQuantity={decreaseProductQuantity}
					resetSelectedProducts={resetSelectedProducts}
					setSideSheetHeading={setSideSheetHeading}
				/> */}
			</SideSheet>
			<Modal open={loginOpen} setOpen={setLoginOpen}>
				{/* <UserLogin setOpen={setLoginOpen} /> */}
			</Modal>
		</div>
	);
};

export default OrderPage;
