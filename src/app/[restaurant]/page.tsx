'use client';

import React, { useEffect } from 'react';

import { useSearchParams } from 'next/navigation';
import { Spinner } from 'xtreme-ui';

import { useRestaurant } from '#components/context/useContext';

import NavSideBar from './_components/NavSideBar';
import OrderPage from './_components/OrderPage';
import './restaurant.scss';

const Restaurant = () => {
	const { restaurant, fetchMenu } = useRestaurant();
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
	];

	useEffect(() => {
		fetchMenu();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (!restaurant) return <Spinner label='Loading...' fullpage />;

	return (
		<div className='restaurant'>
			<NavSideBar navItems={navItems} foot />
			<div className='pageContainer'>
				{tab === 'explore' && <div>Explore page under construction</div>}
				{tab === 'menu' && <OrderPage />}
				{tab === 'reviews' && <div>Reviews page under construction</div>}
				{tab === 'contact' && <div>Contact page under construction</div>}
			</div>
		</div>
	);
};

export default Restaurant;
