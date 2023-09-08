import React, { useState, useEffect } from 'react';

import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Loader from '../components/Base/Loader.jsx';
import AboutSection from '../components/Homepage/AboutSection.jsx';
import FeatureSection from '../components/Homepage/FeatureSection.jsx';
import FooterSection from '../components/Homepage/FooterSection.jsx';
import LandingSection from '../components/Homepage/LandingSection.jsx';
import LoginSection from '../components/Homepage/LoginSection.jsx';
import NavBar from '../components/Homepage/NavBar.jsx';

const Homepage = (props) => {
	const [loading, setLoading] = useState(true);
	const [menuOpen, setMenuOpen] = useState(false);
	const [navItems, setNavItems] = useState(['About Us', 'Features']);

	const userID = useTracker(() => Meteor.userId());
	const user = useTracker(() => Meteor.user());

	const scrollToSection = () => {
		setTimeout(() => {
			const element = document.querySelector(`#${props.section ? props.section : 'home'}`);
			window.scrollTo(0, element?.offsetTop);
		}, 0);
	};

	useEffect(() => {
		setTimeout(() => {
			const element = document.querySelector(`#${props.section ? props.section : 'home'}`);
			window.scrollTo(0, element?.offsetTop);
		}, 0);
	}, [props.section]);

	useEffect(() => {
		Meteor.subscribe('userData');
	}, []);

	useEffect(() => {
		if (!userID && loading) {
			setNavItems([...navItems, 'Login']);
			setLoading(false);
		} else if (user && loading) {
			if (user.role === 'admin') {
				setNavItems([...navItems, 'Dashboard']);
			} else if (user.role === 'kitchen') {
				setNavItems([...navItems, 'Kitchen']);
			}

			setLoading(false);
		}
	}, [userID, user, navItems, loading]);

	useEffect(() => {
		if (!loading) {
			document.querySelector('.app').style.height = 'unset';
		}
	}, [loading]);

	// Show loader before rendering
	if (loading) {
		return <Loader fullpage />;
	}

	return (
		<div className='homepage'>
			<NavBar navItems={navItems} menuOpen={menuOpen} setMenuOpen={setMenuOpen} scrollToSection={scrollToSection} />
			<div className={`homepageSections ${menuOpen ? 'menuOpen' : ''}`}>
				<LandingSection />
				<AboutSection />
				<FeatureSection />
				<LoginSection loggedIn={!!userID} user={user} />
				<FooterSection />
			</div>
			<ToastContainer />
		</div>
	);
};

export default Homepage;
