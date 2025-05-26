/* eslint-disable react/no-danger */
import { ReactNode } from 'react';

import { themeController } from 'xtreme-ui';

import { getThemeColor } from '#utils/database/helper/getThemeColor';

export default async function RootLayout ({ children, params }: IRootProps) {
	const themeColor = await getThemeColor((await params).restaurant);
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
	params: {
		restaurant: string;
	};
}
