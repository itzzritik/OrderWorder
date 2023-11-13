'use client';

import React, { useEffect, useState } from 'react';

import { useSession } from 'next-auth/react';

import { useQueryParams } from '#utils/hooks/useQueryParams';

import NavSideBar from '../[restaurant]/_components/NavSideBar';

import NavTopBar from './_components/NavTopBar';

// import NavTopBar from '../components/Base/NavTopBar.jsx';

const subNavCollection = {
	home: [
		{ label: 'overview', route: 'overview' },
		{ label: 'bills', route: 'bills' },
	],
	orders: [
		{ label: 'requests', route: 'requests' },
		{ label: 'active', route: 'active' },
		{ label: 'history', route: 'history' },
	],
	settings: [
		{ label: 'account', route: 'account' },
		{ label: 'menu', route: 'menu' },
	],
} as const;

const navItems = [
	{ label: 'orders', icon: 'e43f', route: 'orders' },
	{ label: 'settings', icon: 'f013', route: 'settings' },
];

const Dashboard = () => {
	const session = useSession();
	const [subNavItems, setSubNavItems] = useState([]);
	const [floatHeader, setFloatHeader] = useState(false);
	const [showScrollbar, setShowScrollbar] = useState(false);

	const queryParams = useQueryParams();
	const tab = queryParams.get('tab') ?? '';
	const subTab = queryParams.get('subTab') ?? '';

	const onScroll = (event) => {
		if (event.target.scrollTop >= 1) {
			return setFloatHeader(true);
		}
		return setFloatHeader(false);
	};

	useEffect(() => {
		if (session.status === 'unauthenticated') queryParams.router.replace('/');
		if (session?.data?.role === 'kitchen') queryParams.router.replace('/kitchen');
	}, [queryParams.router, session]);

	// useEffect(() => {
	// 	const subNav = subNavCollection[tab];
	// 	if (!subNav) return;

	// 	if (!subNav.some((item) => item.route === subTab)) {
	// 		return history.replace(`/dashboard/${tab}/${subNav[0].route}`);
	// 	}
	// 	setSubNavItems(subNav);
	// 	setFloatHeader(false);
	// }, [history, subTab, subNavCollection, tab]);

	return (
		<div className='dashboard'>
			<NavSideBar navItems={navItems} root='dashboard' foot />
			<div className={`dashboardViewport ${floatHeader ? 'floatHeader' : ''}`}>
				<div className='dashboardHeader'>
					<h1 className='dashboardHeading'>{tab}</h1>
					{/* <NavTopBar navItems={subNavItems} root={`dashboard/${tab}`} /> */}
				</div>
				<div className='dashboardContent'>
					{/* {{
						home: (
							<Home tab={subTab} onScroll={onScroll}
								showScrollbar={showScrollbar} setShowScrollbar={setShowScrollbar}
							/>
						),

						orders: (
							<Orders tab={subTab} onScroll={onScroll}
								showScrollbar={showScrollbar} setShowScrollbar={setShowScrollbar}
							/>
						),

						settings: (
							<Settings tab={subTab} onScroll={onScroll} restaurant={restaurant}
								showScrollbar={showScrollbar} setShowScrollbar={setShowScrollbar}
							/>
						),
					}[tab]} */}
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
