'use client';

import React, { useEffect, useState } from 'react';

import { useSession } from 'next-auth/react';

import { AdminProvider } from '#components/context';
import NavSideBar from '#components/layout/NavSideBar';
import { useQueryParams } from '#utils/hooks/useQueryParams';

import NavTopBar from './_components/NavTopBar';
import Orders from './_components/Orders';
import './dashboard.scss';

const navItems = [
	{ label: 'orders', icon: 'e43b', value: 'orders' },
	{ label: 'settings', icon: 'f013', value: 'settings' },
];

const Dashboard = () => {
	const session = useSession();
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

	return (
		<AdminProvider>
			<div className='dashboard'>
				<NavSideBar navItems={navItems} defaultTab='orders' foot />
				<div className={`dashboardViewport ${floatHeader ? 'floatHeader' : ''}`}>
					<div className='dashboardHeader'>
						<h1 className='dashboardHeading'>{tab}</h1>
						<NavTopBar />
					</div>
					<div className='dashboardContent'>
						{{
						// home: (
						// 	<Home tab={subTab} onScroll={onScroll}
						// 		showScrollbar={showScrollbar} setShowScrollbar={setShowScrollbar}
						// 	/>
						// ),

							// orders: (
							// 	<Orders onScroll={onScroll} showScrollbar={showScrollbar} setShowScrollbar={setShowScrollbar} />
							// ),

						// settings: (
						// 	<Settings tab={subTab} onScroll={onScroll} restaurant={restaurant}
						// 		showScrollbar={showScrollbar} setShowScrollbar={setShowScrollbar}
						// 	/>
						// ),
						}[tab]}
					</div>
				</div>
			</div>
		</AdminProvider>
	);
};

export default Dashboard;
