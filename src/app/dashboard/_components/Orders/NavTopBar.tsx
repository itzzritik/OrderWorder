import { useEffect } from 'react';

import clsx from 'clsx';
import Link from 'next/link';

import { useQueryParams } from '#utils/hooks/useQueryParams';

import './navTopBar.scss';

const subNavItems = {
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
} as Record<string, Array<{ label: string, route: string }>>;

const NavTopBar = (props: TNavTopBarProps) => {
	const { title, menuOpen, onClick } = props;

	const queryParams = useQueryParams();
	const tab = queryParams.get('tab') ?? '';
	const subTab = queryParams.get('subTab') ?? '';

	const currentNav = subNavItems[tab];

	useEffect(() => {
		if (tab && !currentNav?.some((item) => item.route === subTab)) queryParams.set({ subTab: currentNav?.[0]?.route });
	}, [currentNav, queryParams, subTab, tab]);

	return (
		<div className='navTopBar' id='navBar'>
			{title && <Link className='logo' href='/'>{title}</Link>}
			<div className={`menu ${menuOpen ? 'open' : ''}`}>
				<div className='icon ripple round' onClick={onClick}>
					<span className='line1' />
					<span className='line2' />
				</div>
				<div className='navBarContainer'>
					{
						currentNav?.map((item, i) => {
							return (
								<div
									key={i}
									className={clsx('item', subTab === item?.route && 'active')}
									onClick={() => queryParams.set({ subTab: item?.route })}
								>
									<span />
									<p>{item.label}</p>
								</div>
							);
						})
					}
				</div>
			</div>
		</div>
	);
};

export default NavTopBar;

export type TNavTopBarProps = {
	title?: string
	menuOpen?: boolean
	onClick?: () => void
}
