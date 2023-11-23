'use client';

import { useState } from 'react';

import { DashboardProvider } from '#components/context';

import AboutSection from './_homepage/AboutSection';
import FeatureSection from './_homepage/FeatureSection';
import FooterSection from './_homepage/FooterSection';
import LandingSection from './_homepage/LandingSection';
import LoginSection from './_homepage/LoginSection';
import Navbar from './_homepage/Navbar';

export default function Homepage () {
	const [menuOpen, setMenuOpen] = useState(false);

	return (
		<DashboardProvider>
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
		</DashboardProvider>
	);
}
