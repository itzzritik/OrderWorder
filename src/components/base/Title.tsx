'use client';

import { useEffect } from 'react';

import { usePathname } from 'next/navigation';
import { ToastContainer } from 'react-toastify';
import { useXTheme } from 'xtreme-ui';

export default function Title () {
	const pathname = usePathname();
	const { themeScheme } = useXTheme();

	useEffect(() => {
		if (pathname === '/') document.documentElement.setAttribute('data-theme-scheme', 'light');
		else document.documentElement.setAttribute('data-theme-scheme', themeScheme);
	}, [pathname, themeScheme]);

	useEffect(() => {
		document.title = 'OrderWorder⌘';
	}, []);

	return (
		<>
			<ToastContainer />
		</>
	);
}
