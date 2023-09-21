import React, { useState, useEffect, useRef } from 'react';

import Button from 'xtreme-ui';

import Modal from '#components/base/Modal';
import SideSheet from '#components/base/SideSheet';

import SearchButton from '../Base/SearchButton.jsx';

import CartButton from './Cart/CartButton.jsx';
import CartPage from './Cart/CartPage.jsx';
import MenuCard from './MenuCard.jsx';
import MenuCategory from './MenuCategory.jsx';
import UserLogin from './UserLogin.jsx';

const OrderPage = () => {
	const [category, setCategory] = useState(0);

	const [topHeading, setTopHeading] = useState(['Menu', 'Category']);
	const [orderHeading, setOrderHeading] = useState(['Explore', 'Menu']);
	const [sideSheetHeading, setSideSheetHeading] = useState(['Your', 'Order']);
	const [floatHeader, setFloatHeader] = useState(false);
	const [showScrollbar, setShowScrollbar] = useState(false);

	const [hasImageItems, setHasImageItems] = useState(false);
	const [hasNonImageItems, setHasNonImageItems] = useState(false);

	const [leftCategoryScroll, setLeftCategoryScroll] = useState(false);
	const [rightCategoryScroll, setRightCategoryScroll] = useState(true);

	const [searchActive, setSearchActive] = useState(false);
	const [searchValue, setSearchValue] = useState('');

	const [sideSheetOpen, setSideSheetOpen] = useState(false);
	const [loginOpen, setLoginOpen] = useState(false);

	const [filteredProducts, setFilteredProducts] = useState(props.menuItems);
	const [selectedProducts, setSelectedProducts] = useState([]);
	const [showInfoCard, setShowInfoCard] = useState(false);

	const userID = useTracker(() => Meteor.userId());
	const user = useTracker(() => Meteor.user());
	const order = useRef();
	const categories = useRef();
	const history = useHistory();
	const location = useLocation();
	const tableID = new URLSearchParams(location.search).get('tableID');

	const onOrderScroll = (event) => {
		if (event.target.scrollTop > 30) {
			setFloatHeader(true);
			setShowScrollbar(false);
			setTopHeading(['Menu', 'Category']);

			if (event.target.scrollTop >= order?.current?.offsetTop - 15) {
				setTopHeading(orderHeading);
				setShowScrollbar(true);
			}
			return;
		}

		setShowScrollbar(false);
		return setFloatHeader(false);
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
		categories.current.scrollLeft -= 400;
	};
	const categoryScrollRight = () => {
		categories.current.scrollLeft += 400;
	};
	const increaseProductQuantity = (product) => {
		const selection = [...selectedProducts];
		product = {
			_id: product._id,
		};
		if (selectedProducts.some((item) => item._id === product._id)) {
			selection.forEach((item) => {
				if (product._id === item._id) {
					item.quantity++;
				}
			});
		} else {
			product.quantity = 1;
			selection.push(product);
		}
		setSelectedProducts(selection);
	};
	const decreaseProductQuantity = (product) => {
		let selection = [...selectedProducts];
		product = {
			_id: product._id,
		};
		selection.forEach((item) => {
			if (product._id === item._id) {
				item.quantity--;
				if (item.quantity === 0) {
					const filter = selection.filter((tempItem) => tempItem._id !== product._id);
					selection = [...filter];
				}
			}
		});
		setSelectedProducts(selection);
	};
	const resetSelectedProducts = () => {
		setSelectedProducts([]);
	};
	const onSearchActive = (value) => {
		setSearchActive(!!searchValue || value);
	};
	const onCategoryClicked = (key) => {
		setCategory(key);
	};
	const onLoginClick = () => {
		if (tableID) {
			return setLoginOpen(true);
		}

		return history.push('/scan');
	};

	useEffect(() => {
		setHasImageItems(filteredProducts.some((product) => !!product.image));
		setHasNonImageItems(filteredProducts.some((product) => !product.image));
	}, [filteredProducts]);

	useEffect(() => {
		const categoryTitle = props.restaurant.categories[category];

		if (searchValue && searchValue.length > 0) {
			setFilteredProducts(props.menuItems.filter(({ name, description, category }) =>
				name.toLowerCase().includes(searchValue.toLowerCase())
				|| description?.toLowerCase().includes(searchValue.toLowerCase())
				|| category.some((item) => item?.toLowerCase().includes(searchValue.toLowerCase()))));
		} else if (categoryTitle.toLowerCase() === 'all') {
			setFilteredProducts(props.menuItems);
		} else {
			setFilteredProducts(props.menuItems.filter(({ category }) => category.includes(categoryTitle)));
		}
	}, [searchValue, category, props.menuItems, props.restaurant.categories]);

	useEffect(() => {
		if (userID) {
			setOrderHeading(['Choose', 'Order']);
		} else {
			setOrderHeading(['Explore', 'Menu']);
		}
	}, [userID]);

	useTracker(() => {
		if (user?.role === 'table' && tableID === null) {
			Meteor.call('tableLogout');
		}
		if (user?.role === 'table' && tableID !== user?.username) {
			Meteor.call('tableLogout');
		}
	}, [tableID]);

	return (
		<div className='orderPage'>
			<div className='mainContainer'>
				<div className={`mainHeader ${searchActive ? 'searchActive' : ''} ${floatHeader ? 'floatHeader' : ''}`}>
					<h1>{topHeading[0]} <span>{topHeading[1]}</span></h1>
					<div className='options'>
						<SearchButton setSearchActive={onSearchActive} placeholder='Search for food'
							value={searchValue} setValue={setSearchValue}
						/>
						{
							(user?.role !== 'admin' && user?.role !== 'kitchen') && (
								!userID
									? <Button className='loginButton' label={tableID ? 'Order' : 'Scan'}
										round filled onClick={onLoginClick}
									  />

									: <CartButton quantity={selectedProducts.length}
										onClick={() => setSideSheetOpen(true)}
									  />
							)
						}
						{
							user?.role === 'admin'
								&& <Button className='dashboardButton' label='Dashboard'
									round filled onClick={() => history.push('/dashboard')}
								   />
						}
						{
							user?.role === 'kitchen'
								&& <Button className='kitchenButton' label='Kitchen'
									round filled onClick={() => history.push('/kitchen')}
								   />
						}
					</div>
				</div>
				<div className={`category ${searchValue ? 'disable' : ''}`}>
					<div className='itemCategories' ref={categories} onScroll={onCategoryScroll}>
						{
							props.restaurant.categories.map((item, key) =>
								(<MenuCategory key={key} title={item}
									itemKey={key} active={category === key} onClick={onCategoryClicked}
								/>))
						}
						<div className='space' />
					</div>
					<div className={`scrollLeft ${leftCategoryScroll ? 'show' : ''}`} onClick={categoryScrollLeft}>
						<span style={getIconMask('/icons/Base/arrowLeft.svg')} />
					</div>
					<div className={`scrollRight ${rightCategoryScroll ? 'show' : ''}`} onClick={categoryScrollRight}>
						<span style={getIconMask('/icons/Base/arrowRight.svg')} />
					</div>
				</div>
				<div className='order' ref={order}>
					<div className='header'>
						<h1>{orderHeading[0]} <span>{orderHeading[1]}</span></h1>
					</div>
					{
						hasImageItems
						&& <div className={`itemContainer ${!userID ? 'restrictOrder ' : ''}`}>
							<div>
								{
									filteredProducts.map((item, key) =>
										!item.hidden && <MenuCard key={key} item={item} restrictOrder={!userID}
											increaseQuantity={increaseProductQuantity}
											decreaseQuantity={decreaseProductQuantity}
											showInfo={item._id === showInfoCard}
											setShowInfo={setShowInfoCard} show={!!item.image}
											quantity={selectedProducts.some((obj) => obj._id === item._id)
											&& selectedProducts.find((obj) => obj._id === item._id).quantity}
										                />)
								}
							</div>
						</div>
					}
					{hasImageItems && hasNonImageItems && <hr />}
					{
						hasNonImageItems
						&& <div className={`itemContainer withoutImage ${!userID ? 'restrictOrder ' : ''}`}>
							<div>
								{
									filteredProducts.map((item, key) =>
										!item.hidden && <MenuCard key={key} item={item} restrictOrder={!userID}
											increaseQuantity={increaseProductQuantity}
											decreaseQuantity={decreaseProductQuantity}
											showInfo={item._id === showInfoCard}
											setShowInfo={setShowInfoCard} show={!item.image}
											quantity={selectedProducts.some((obj) => obj._id === item._id)
											&& selectedProducts.find((obj) => obj._id === item._id).quantity}
										                />)
								}
							</div>
						</div>
					}
				</div>
			</div>
			<SideSheet title={sideSheetHeading} open={sideSheetOpen} setOpen={setSideSheetOpen}>
				<CartPage
					selectedProducts={selectedProducts}
					increaseProductQuantity={increaseProductQuantity}
					decreaseProductQuantity={decreaseProductQuantity}
					resetSelectedProducts={resetSelectedProducts}
					setSideSheetHeading={setSideSheetHeading}
				/>
			</SideSheet>
			<Modal open={loginOpen} setOpen={setLoginOpen}>
				<UserLogin setOpen={setLoginOpen} restaurantID={props.restaurant.restaurantID} />
			</Modal>
		</div>
	);
};

export default OrderPage;
