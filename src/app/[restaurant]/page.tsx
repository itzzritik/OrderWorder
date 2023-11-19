'use client';

import { useSearchParams } from 'next/navigation';

import { CustomerProvider } from '#components/context';
import NavSideBar from '#components/layout/NavSideBar';
import UnderConstruction from '#components/layout/UnderConstruction';

import OrderPage from './_components/Menu/OrderPage';
import './restaurant.scss';

const navItems = [
	{ label: 'explore', value: 'explore', icon: 'f015' },
	{ label: 'menu', value: 'menu', icon: 'e3e3' },
	{ label: 'reviews', value: 'reviews', icon: 'f4ad' },
	{ label: 'contact', value: 'contact', icon: 'f8d3' },
	{ label: 'sign out', value: 'signout', icon: 'f011' },
];

const Restaurant = () => {
	const searchParams = useSearchParams();

	const tab = searchParams.get('tab');

	return (
		<CustomerProvider>
			<div className='restaurant'>
				<NavSideBar navItems={navItems} defaultTab='menu' foot />
				<div className='pageContainer'>
					{tab === 'explore' && <UnderConstruction />}
					{tab === 'menu' && <OrderPage />}
					{tab === 'reviews' && <UnderConstruction />}
					{tab === 'contact' && <UnderConstruction />}
				</div>
			</div>
		</CustomerProvider>
	);
};

export default Restaurant;
