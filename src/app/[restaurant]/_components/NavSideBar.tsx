import React, { useEffect } from 'react';

import clsx from 'clsx';
import { Icon } from 'xtreme-ui';

import { useQueryParams } from '#utils/hooks/useQueryParams';

import './navSideBar.scss';

const NavSideBar = (props: TNavSideBar) => {
	const { head, foot, navItems } = props;
	const queryParams = useQueryParams();

	const classList = clsx(
		'menu',
		head && 'head',
		foot && 'foot',
	);

	useEffect(() => {
		if (!queryParams.get('tab')) queryParams.set({ tab: 'menu' });
	}, [queryParams]);

	return (
		<div className='navSideBar'>
			<div className={classList}>
				{
					navItems.map((item, key) => {
						const active = queryParams.get('tab') === item.value;
						return (
							<div
								key={key}
								className={clsx('navItem', active && 'active')}
								onClick={() => queryParams.set({ tab: item.value })}
							>
								<div className='navItemContent'>
									<Icon code={item.icon} size={20} type={active ? 'solid' : 'duotone'} />
									<p>{item.label}</p>
								</div>
							</div>);
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
