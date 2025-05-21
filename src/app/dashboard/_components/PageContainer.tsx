'use client';

import { UIEvent, useEffect, useState } from 'react';

import { useSession } from 'next-auth/react';

import { useQueryParams } from '#utils/hooks/useQueryParams';

import NavTopBar from './Orders/NavTopBar';
import Orders from './Orders/Orders';
import Settings from './Settings/Settings';

export default function PageContainer () {
	const session = useSession();
	const [floatHeader, setFloatHeader] = useState(false);
	const queryParams = useQueryParams();
	const tab = queryParams.get('tab') ?? '';

	const onScroll = (event: UIEvent<HTMLDivElement>) => {
		if ((event.target as HTMLDivElement).scrollTop >= 1)
			return setFloatHeader(true);
		return setFloatHeader(false);
	};

	useEffect(() => {
		if (session.status === 'unauthenticated')
			queryParams.router.replace('/');
		if (session?.data?.role === 'kitchen')
			queryParams.router.replace('/kitchen');
	}, [queryParams.router, session]);

	return (
		<div
			className={`dashboardViewport ${floatHeader ? 'floatHeader' : ''}`}
		>
			<div className='dashboardHeader'>
				<h1 className='dashboardHeading'>{tab}</h1>
				<NavTopBar />
			</div>
			<div className='dashboardContent'>
				{
					{
						// home: (
						// 	<Home tab={subTab} onScroll={onScroll}
						// 		showScrollbar={showScrollbar} setShowScrollbar={setShowScrollbar}
						// 	/>
						// ),

						orders: <Orders onScroll={onScroll} />,

						settings: <Settings onScroll={onScroll} />,
					}[tab]
				}
			</div>
		</div>
	);
}
