import React, { useEffect } from 'react';

import clsx from 'clsx';
import { signOut, useSession } from 'next-auth/react';
import { Icon } from 'xtreme-ui';

import { useQueryParams } from '#utils/hooks/useQueryParams';

import './navSideBar.scss';

const NavSideBar = (props: TNavSideBar) => {
	const { head, foot, navItems } = props;
	const session = useSession();
	const queryParams = useQueryParams();

	const classList = clsx(
		'menu',
		head && 'head',
		foot && 'foot',
	);

	const onNavClick = (tab: string) => {
		if (tab === 'signout') return signOut();
		queryParams.set({ tab });
	};

	useEffect(() => {
		if (!queryParams.get('tab')) queryParams.set({ tab: 'menu' });
	}, [queryParams]);

	return (
		<div className='navSideBar'>
			<div className={classList}>
				{
					navItems.map((item, key) => {
						if (item.value === 'signout' && session.status === 'unauthenticated') return null;

						const active = queryParams.get('tab') === item.value;
						return (
							<div
								key={key}
								className={clsx('navItem', active && 'active')}
								onClick={() => onNavClick(item.value)}
							>
								<div className='navItemContent'>
									<Icon code={item.icon} size={20} type={active ? 'solid' : 'duotone'} />
									<p>{item.label}</p>
								</div>
							</div>
						);
					})
				}
			</div>
		</div>
	);
};

export default NavSideBar;

type TNavSideBar = {
	navItems: Array<{
		label: string,
		value: string,
		icon: string,
	}>,
	head?: boolean,
	foot?: boolean,
}
