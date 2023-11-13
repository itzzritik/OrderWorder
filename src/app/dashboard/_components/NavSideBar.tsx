import React from 'react';

import clsx from 'clsx';
import { Icon } from 'xtreme-ui';

import './navSideBar.scss';

const NavSideBar = (props: TNavSideBarProps) => {
	const { head, foot, navItems } = props;

	const classList = clsx(
		'menu',
		head && 'head',
		foot && 'foot',
	);

	return (
		<div className='navSideBar'>
			<div className={classList}>
				{
					navItems?.map((item, key) =>
						(
							<p className='navItem' key={key}>
								<div className='navItemContent'>
									<Icon code={item.icon} />
									<p>{item.label}</p>
								</div>
							</p>
						),
					)
				}
			</div>
		</div>
	);
};

export default NavSideBar;

type TNavSideBarProps = {
	head: boolean,
	foot: boolean,
	navItems: Array<{ label: string, icon: string, route: string }>
}
