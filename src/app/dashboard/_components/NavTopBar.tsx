import React from 'react';

import { NavLink, Link } from 'react-router-dom';

const NavTopBar = (props) => {
	return (
		<div className='navTopBar' id='navBar'>
			{props.title && <NavLink to='/' className='logo' tag={Link}>{props.title}</NavLink>}
			<div className={`menu ${props.menuOpen ? 'open' : ''}`}>
				<div className='icon ripple round' onClick={props.onClick}>
					<span className='line1' />
					<span className='line2' />
				</div>
				<div className='navBarContainer'>
					{
						props.navItems.map((item, key) => {
							return (<NavLink className='item' key={key} tag={Link}
								to={`/${props.root}/${item.route}`}
								activeClassName='active' onClick={props.onClick}
							        >
								<span />
								<p>{item.label}</p>
							</NavLink>);
						})
					}
				</div>
			</div>
		</div>
	);
};

export default NavTopBar;
