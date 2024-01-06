import { SyntheticEvent, UIEvent, useEffect, useMemo, useRef, useState } from 'react';

import { signOut, useSession } from 'next-auth/react';
import { ActionCard, Button, Icon, Spinner } from 'xtreme-ui';

import SearchButton from '#components/base/SearchButton';
import SideSheet from '#components/base/SideSheet';
import { useOrder, useRestaurant } from '#components/context/useContext';
import Modal from '#components/layout/Modal';
import { TMenu } from '#utils/database/models/menu';
import { useQueryParams } from '#utils/hooks/useQueryParams';

import CartPage from './CartPage';
import MenuCard from './MenuCard';
import UserLogin from './UserLogin';
import './orderPage.scss';

const OrderPage = () => {
	const session = useSession();
	const { loading } = useOrder();
	const { restaurant } = useRestaurant();

	const menus = restaurant?.menus as Array<TMenuCustom>;
	const params = useQueryParams();
	const table = params.get('table');
	const searchParam = params.get('search')?.trim() ?? '';
	const categoryParam = params.get('category')?.trim();
	const category = useMemo(() => (categoryParam ? categoryParam.split(',') : []), [categoryParam]);

	const order = useRef<HTMLDivElement>(null);
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
	const [showInfoCard, setShowInfoCard] = useState(false);

	const [filteredProducts, setFilteredProducts] = useState<Array<TMenuCustom>>(menus);
	const [selectedProducts, setSelectedProducts] = useState<Array<TMenuCustom>>([]);
	const [hasImageItems, setHasImageItems] = useState(false);
	const [hasNonImageItems, setHasNonImageItems] = useState(false);

	const showOrderButton = restaurant?.tables?.some(({ username }) => username === table);
	const eligibleToOrder = session.data?.role === 'customer' && showOrderButton;

	const onMenuScroll = (event: UIEvent<HTMLDivElement>) => {
		const scrollTop = (event.target as HTMLDivElement).scrollTop;
		if (scrollTop > 30) {
			setFloatHeader(true);
			setTopHeading(['Menu', 'Category']);
			if (order?.current && scrollTop >= order?.current?.offsetTop - 15) setTopHeading(orderHeading);
			return;
		}
		return setFloatHeader(false);
	};
	const onCategoryScroll = (event: SyntheticEvent) => {
		const target = event.target as HTMLElement;

		if (target.scrollLeft > 50) setLeftCategoryScroll(true);
		else setLeftCategoryScroll(false);

		if (Math.round(target.scrollWidth - target.scrollLeft) - 50 > target.clientWidth) setRightCategoryScroll(true);
		else setRightCategoryScroll(false);
	};
	const categoryScrollLeft = () => {
		if (categories.current) categories.current.scrollLeft -= 400;
	};
	const categoryScrollRight = () => {
		if (categories.current) categories.current.scrollLeft += 400;
	};
	const onCategoryClick = (categoryName: string) => {
		let newCategory = [];
		if (category.includes(categoryName)) newCategory = category.filter((item) => item !== categoryName);
		else newCategory = [...category, categoryName];

		params.set({ category: newCategory.join(',') });
	};
	const onLoginClick = () => {
		if (table) return setLoginOpen(true);
		return params.router.push('/scan');
	};
	const increaseProductQuantity = (product: TMenuCustom) => {
		const selection = [...selectedProducts];
		if (selectedProducts.some((item) => item._id === product._id)) {
			selection.forEach((item) => {
				if (product._id === item._id) item.quantity++;
			});
		} else {
			product.quantity = 1;
			selection.push(product);
		}
		setSelectedProducts(selection);
	};
	const decreaseProductQuantity = (product: TMenuCustom) => {
		let selection = [...selectedProducts];
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

	useEffect(() => {
		const search = searchParam.toLowerCase();

		setFilteredProducts(
			menus?.filter?.(({ name, description, category: cat }) =>
				(search
					? name?.toLowerCase().includes(search) || description?.toLowerCase().includes(search) || cat?.toLowerCase().includes(search)
					: true
				)
				&& (category.length ? category.includes(cat) : true),
			),
		);

	}, [category, menus, searchParam]);

	useEffect(() => {
		params.set({ category: category.filter((e) => restaurant?.profile.categories.includes(e)).join(',') });
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [category, restaurant]);
	useEffect(() => {
		params.set({ search: searchValue });
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchValue]);

	useEffect(() => {
		setHasImageItems(filteredProducts?.some((product) => !!product.image) ?? false);
		setHasNonImageItems(filteredProducts?.some((product) => !product.image) ?? false);
	}, [filteredProducts]);

	useEffect(() => {
		if (session.data?.role === 'customer') setOrderHeading(['Choose', 'Order']);
		else setOrderHeading(['Explore', 'Menu']);
	}, [session]);

	useEffect(() => {
		if (session.status === 'authenticated' && session.data?.restaurant?.username !== restaurant?.username) signOut();
	}, [restaurant?.username, session.data?.restaurant?.username, session.status]);

	return (
		<div className='orderPage'>
			<div className='mainContainer' onScroll={onMenuScroll}>
				<div className={`mainHeader ${searchActive ? 'searchActive' : ''} ${floatHeader ? 'floatHeader' : ''}`}>
					<h1>{topHeading[0]} <span>{topHeading[1]}</span></h1>
					<div className='options'>
						<SearchButton
							setSearchActive={setSearchActive}
							placeholder='Search menu'
							value={searchValue}
							setValue={setSearchValue}
						/>
						{
							(!session.data?.role || !showOrderButton) &&
							<Button className='loginButton' label={showOrderButton ? 'Order' : 'Scan'} onClick={onLoginClick} />
						}
						{
							eligibleToOrder &&
							<Button
								icon='e43b'
								label={(selectedProducts?.length > 0 ? selectedProducts?.length : '') + ''}
								onClick={() => setSideSheetOpen(true)}
							/>
						}
						{
							session.data?.role === 'admin' &&
							<Button
								className='dashboardButton'
								label='Dashboard'
								icon='e09f'
								iconType='solid'
								onClick={() => params.router.push('/dashboard')}
							/>
						}
						{
							session.data?.role === 'kitchen' &&
							<Button
								className='kitchenButton'
								label='Kitchen'
								icon='e09f'
								iconType='solid'
								onClick={() => params.router.push('/kitchen')}
							/>
						}
					</div>
				</div>
				{
					restaurant &&
					<div className='category'>
						<div className='itemCategories' ref={categories} onScroll={onCategoryScroll}>
							{
								restaurant?.profile?.categories?.map((item, i) => (
									<ActionCard
										key={i}
										className={`menuCategory ${category.includes(item) ? 'active' : ''}`}
										onClick={() => onCategoryClick(item)}
									>
										<span className='title'>{item}</span>
									</ActionCard>
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
				}
				{
					!restaurant
						? <Spinner label='Loading Menu...' fullpage />
						:
						<div className='order' ref={order}>
							<div className='header'>
								<h1>{orderHeading[0]} <span>{orderHeading[1]}</span></h1>
							</div>
							{
								hasImageItems &&
								<div className={`itemContainer ${!eligibleToOrder ? 'restrictOrder ' : ''}`}>
									<div>
										{
											filteredProducts?.map((item, key) => (
												!item.hidden &&
												<MenuCard key={key} item={item} restrictOrder={!eligibleToOrder}
													increaseQuantity={increaseProductQuantity}
													decreaseQuantity={decreaseProductQuantity}
													showInfo={item._id.toString() === showInfoCard.toString()}
													setShowInfo={(v) => setShowInfoCard(v)} show={!!item.image}
													quantity={(
														selectedProducts.some((obj) => obj._id === item._id) &&
														selectedProducts?.find((obj) => obj._id === item._id)?.quantity) || 0
													}
												/>
											))
										}
									</div>
								</div>
							}
							{hasImageItems && hasNonImageItems && <hr />}
							{
								hasNonImageItems &&
									<div className={`itemContainer withoutImage ${!eligibleToOrder ? 'restrictOrder ' : ''}`}>
										<div>
											{
												filteredProducts?.map((item, key) => (
													<MenuCard key={key} item={item} restrictOrder={!eligibleToOrder}
														increaseQuantity={increaseProductQuantity}
														decreaseQuantity={decreaseProductQuantity}
														showInfo={item._id.toString() === showInfoCard.toString()}
														setShowInfo={(v) => setShowInfoCard(v)} show={!!item.image}
														quantity={(selectedProducts.some((obj) => obj._id === item._id)
											&& selectedProducts?.find((obj) => obj._id === item._id)?.quantity) || 0}
													/>
												))
											}
										</div>
									</div>
							}
						</div>

				}
			</div>
			<SideSheet title={sideSheetHeading} open={sideSheetOpen} setOpen={setSideSheetOpen}>
				{
					loading ?
						<Spinner label='Loading Order...' fullpage />
						:
						<CartPage
							selectedProducts={selectedProducts}
							increaseProductQuantity={increaseProductQuantity}
							decreaseProductQuantity={decreaseProductQuantity}
							resetSelectedProducts={() => setSelectedProducts([])}
							setSideSheetHeading={setSideSheetHeading}
						/>
				}
			</SideSheet>
			<Modal open={loginOpen} setOpen={setLoginOpen}>
				<UserLogin setOpen={setLoginOpen} />
			</Modal>
		</div>
	);
};

export default OrderPage;

type TMenuCustom = TMenu & {quantity: number}
