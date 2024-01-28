import { useEffect } from 'react';

import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ToastContainer } from 'react-toastify';
import { useXTheme } from 'xtreme-ui';

import { useAdmin, useRestaurant } from '#components/context/useContext';
import { isValidRGB } from '#utils/helper/common';

export const ThemeManager = () => {
	const session = useSession();
	const pathname = usePathname();
	const { restaurant } = useRestaurant();
	const { profile } = useAdmin();
	const { themeScheme } = useXTheme();

	useEffect(() => {
		const themeColor = profile?.themeColor ?? restaurant?.profile?.themeColor;

		if (isValidRGB(themeColor))
			document.documentElement.style.setProperty('--colorBrandAccentRgb', `${themeColor?.r} ${themeColor?.g} ${themeColor?.b}`);
	}, [profile?.themeColor, restaurant?.profile?.themeColor, session.data?.role]);

	useEffect(() => {
		if (pathname === '/') document.documentElement.setAttribute('data-theme-scheme', 'light');
		else document.documentElement.setAttribute('data-theme-scheme', themeScheme);

		document.documentElement.setAttribute('data-theme-color', 'black');
	}, [pathname, themeScheme]);

	useEffect(() => {
		document.title = 'OrderWorder⌘';
	}, []);

	return (
		<ToastContainer position='top-center' theme={themeScheme === 'light' ? 'light' : 'dark'} />
	);
};
