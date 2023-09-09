import { useState } from 'react';

import { scrollToSection } from '#utils/helper/common';

import './navbar.scss';

export default function Navbar ({ menuOpen, setMenuOpen }: TNavBarProps) {
	const [navItems, setNavItems] = useState(['About Us', 'Features']);

	return (
		<div className='homeNavbar' id='homepage-navBar'>
			<p className='logo' onClick={() => scrollToSection()}>ORDER WORDER</p>
			<div className={`menu ${menuOpen ? 'open' : ''}`}>
				<div className='icon round' onClick={() => setMenuOpen(!menuOpen)}>
					<span className='line1' />
					<span className='line2' />
				</div>
				<div className='container'>
					{
						navItems.map((item, key) => {
							return (
								<p
									key={key}
									className='item'
									onClick={() => {
										scrollToSection('homepage-' + item.toLowerCase().replace(/ /g, ''));
										setMenuOpen(false);
									}}
								>
									<span />
									<p>{item}</p>
								</p>
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
