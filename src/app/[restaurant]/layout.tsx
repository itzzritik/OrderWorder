/* eslint-disable react/no-danger */
import { getServerProfile } from '#utils/database/helper/getServerProfile';
import { ReactNode } from 'react';

import { themeController } from 'xtreme-ui';

export default async function RootLayout ({ children, params }: IRootProps) {
	const profile = await getServerProfile(params.restaurant);
	return (
		<>
			<head>
				<script dangerouslySetInnerHTML={{ __html: themeController('auto', profile?.themeColor) }} suppressHydrationWarning />
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
