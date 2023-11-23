'use client';

import { UIEvent, useEffect, useState } from 'react';

import { useSession } from 'next-auth/react';

import { DashboardProvider } from '#components/context';
import NavSideBar from '#components/layout/NavSideBar';
import { useQueryParams } from '#utils/hooks/useQueryParams';

import NavTopBar from './_components/Orders/NavTopBar';
import Orders from './_components/Orders/Orders';
import Settings from './_components/Settings/Settings';
import './dashboard.scss';

const navItems = [
	{ label: 'orders', icon: 'e43b', value: 'orders' },
	{ label: 'settings', icon: 'f013', value: 'settings' },
];

const Dashboard = () => {
	const session = useSession();
	const [floatHeader, setFloatHeader] = useState(false);

	const queryParams = useQueryParams();
	const tab = queryParams.get('tab') ?? '';

	const onScroll = (event: UIEvent<HTMLDivElement>) => {
		if ((event.target as HTMLDivElement).scrollTop >= 1) return setFloatHeader(true);
		return setFloatHeader(false);
	};

	useEffect(() => {
		if (session.status === 'unauthenticated') queryParams.router.replace('/');
		if (session?.data?.role === 'kitchen') queryParams.router.replace('/kitchen');
	}, [queryParams.router, session]);

	return (
		<DashboardProvider>
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

							orders: (
								<Orders onScroll={onScroll} />
							),

							settings: (
								<Settings onScroll={onScroll} />
							),
						}[tab]}
					</div>
				</div>
			</div>
		</DashboardProvider>
	);
};

export default Dashboard;
