/* eslint-disable react/no-danger */
import { ReactNode } from 'react';

import { themeController } from 'xtreme-ui';

import { GlobalProvider } from '#components/context';
import { montserrat } from '#utils/helper/fontHelper';

import './globals.scss';

export const metadata = {
	title: 'Profile',
};
export default function RootLayout ({ children }: IRootProps) {
	return (
		<html lang='en' className={montserrat.variable} suppressHydrationWarning>
			<head>
				<script dangerouslySetInnerHTML={{ __html: themeController('system', 'black') }} suppressHydrationWarning />
			</head>
			<body suppressHydrationWarning>
				<GlobalProvider>
					{ children }
				</GlobalProvider>
			</body>
		</html>
	);
}

interface IRootProps {
	children?: ReactNode;
}
