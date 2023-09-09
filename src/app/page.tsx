import React, { useState } from 'react';

import LandingSection from './_homepage/LandingSection';
import Navbar from './_homepage/Navbar';

export default function Homepage () {
	const [menuOpen, setMenuOpen] = useState(false);

	return (
		<div className='homepage'>
			<Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
			<div className={`homepageSections ${menuOpen ? 'menuOpen' : ''}`}>
				<LandingSection />
				<AboutSection />
				<FeatureSection />
				<LoginSection />
				<FooterSection />
			</div>
		</div>
	);
}
