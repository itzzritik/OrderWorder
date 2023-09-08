/* eslint-disable react/no-danger */
import React, { ReactNode } from 'react';

import { themeController } from 'xtreme-ui';

import Title from '#components/base/Title';
import GlobalProvider from '#components/context';
import Sider from '#components/layout/Sider';
import { montserrat } from '#utils/helper/fontHelper';

import './globals.scss';

export const metadata = {
	title: 'Profile',
};
export default function RootLayout ({ children }: IRootProps) {
	return (
		<html lang='en' className={montserrat.variable} suppressHydrationWarning>
			<head>
				<script dangerouslySetInnerHTML={{ __html: themeController }} />
			</head>
			<body suppressHydrationWarning>
				<Title />
				<GlobalProvider>
					<Sider>
						{ children }
					</Sider>
				</GlobalProvider>
			</body>
		</html>
	);
}

interface IRootProps {
	children?: ReactNode;
}
