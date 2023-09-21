'use client';

import React from 'react';

import { useSearchParams } from 'next/navigation';

import NavSideBar from './_components/NavSideBar';
import OrderPage from './_components/OrderPage';
import './restaurant.scss';

const Restaurant = () => {
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
