/* eslint-disable react/no-danger */
import { ReactNode } from 'react';

import { themeController } from 'xtreme-ui';

import { getThemeColor } from '#utils/database/helper/getThemeColor';

export const metadata = {
	title: 'OrderWorder ⌘ Admin',
};
export default async function RootLayout ({ children }: IRootProps) {
	const themeColor = await getThemeColor();
	return (
		<>
			<head>
				<script dangerouslySetInnerHTML={{ __html: themeController({color: themeColor}) }} suppressHydrationWarning />
			</head>
			<body suppressHydrationWarning>
				{ children }
			</body>
		</>
	);
}

interface IRootProps {
	children?: ReactNode;
}
