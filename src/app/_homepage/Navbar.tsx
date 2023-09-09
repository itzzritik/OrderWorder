import React, { useState } from 'react';

import Link from 'next/link';

import { scrollToSection } from '#utils/helper/common';

import './navbar.scss';

export default function Navbar ({ menuOpen, setMenuOpen }: TNavBarProps) {
	const [navItems, setNavItems] = useState(['About Us', 'Features']);

	return (
		<div className='homeNavbar' id='navBar'>
			<Link className='logo' href='/'>ORDER WORDER</Link>
			<div className={`menu ${menuOpen ? 'open' : ''}`}>
				<div className='icon round' onClick={() => setMenuOpen(!menuOpen)}>
					<span className='line1' />
					<span className='line2' />
				</div>
				<div className='container'>
					{
						navItems.map((item, key) => {
							return (
								<Link
									key={key}
									className='item'
									href={item.toLowerCase().replace(/ /g, '')}
									onClick={() => {
										scrollToSection(item.toLowerCase().replace(/ /g, ''));
										setMenuOpen(false);
									}}
								>
									<span />
									<p>{item}</p>
								</Link>
							);
						})
					}
				</div>
			</div>
		</div>
	);
}

type TNavBarProps = {
	menuOpen: boolean;
	setMenuOpen: (menuOpen: boolean) => void;
}
