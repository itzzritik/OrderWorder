/* eslint-disable react/no-danger */
import { ReactNode } from 'react';

import { themeController } from 'xtreme-ui';

import { getServerProfile } from '#utils/database/helper/getServerProfile';

export const metadata = {
	title: 'OrderWorder ⌘ Admin',
};
export default async function RootLayout ({ children }: IRootProps) {
	const profile = await getServerProfile();
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
}
