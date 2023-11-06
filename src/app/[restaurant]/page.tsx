'use client';

import React, { useEffect } from 'react';

import { usePathname, useSearchParams } from 'next/navigation';
import { Spinner } from 'xtreme-ui';

import { useRestaurant } from '#components/context/useContext';
import UnderConstruction from '#components/layout/UnderConstruction';

import NavSideBar from './_components/NavSideBar';
import OrderPage from './_components/OrderPage';
import './restaurant.scss';

const Restaurant = () => {
	const { restaurant, fetchMenu } = useRestaurant();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const tab = searchParams.get('tab');

	const navItems = [
		{
			label: 'explore',
			value: 'explore',
			icon: 'f015',
		},
		{
			label: 'menu',
			value: 'menu',
			icon: 'e3e3',
		},
		{
			label: 'reviews',
			value: 'reviews',
			icon: 'f4ad',
		},
		{
			label: 'contact',
			value: 'contact',
			icon: 'f095',
		},
		{
			label: 'sign out',
			value: 'signout',
			icon: 'f011',
		},
	];

	useEffect(() => {
		fetchMenu();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pathname]);

	if (!restaurant) return <Spinner label='Loading...' fullpage />;

	return (
		<div className='restaurant'>
			<NavSideBar navItems={navItems} foot />
			<div className='pageContainer'>
				{tab === 'explore' && <UnderConstruction />}
				{tab === 'menu' && <OrderPage />}
				{tab === 'reviews' && <UnderConstruction />}
				{tab === 'contact' && <UnderConstruction />}
			</div>
		</div>
	);
};

export default Restaurant;
