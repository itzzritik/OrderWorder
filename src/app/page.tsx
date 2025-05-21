import { ThemeColorsPreset, themeController } from 'xtreme-ui';

import { DashboardProvider } from '#components/context';

import PageContainer from './_homepage/PageContainer';
import { getThemeColor } from '#utils/database/helper/getThemeColor';
import { DEFAULT_THEME_COLOR } from '#utils/constants/common';

export default async function Homepage () {
	const themeColor = await getThemeColor();
	console.log('themeColor', themeColor);
	return (
		<>
			<head>
				<script
					dangerouslySetInnerHTML={{
						__html: themeController('auto', themeColor ?? DEFAULT_THEME_COLOR),
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
