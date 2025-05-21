import { ThemeColorsPreset, themeController } from 'xtreme-ui';

import { DashboardProvider } from '#components/context';

import PageContainer from './_homepage/PageContainer';
import { getServerProfile } from '#utils/database/helper/getServerProfile';
import { DEFAULT_THEME_COLOR } from '#utils/constants/common';

export default async function Homepage () {
	const profile = await getServerProfile();
	return (
		<>
			<head>
				<script
					dangerouslySetInnerHTML={{
						__html: themeController('auto', profile?.themeColor ?? DEFAULT_THEME_COLOR),
					}}
					suppressHydrationWarning
				/>
			</head>
			<body>
				<DashboardProvider>
					<PageContainer />
				</DashboardProvider>
			</body>
		</>
	);
}
