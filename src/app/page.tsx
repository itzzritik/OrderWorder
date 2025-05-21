import { DashboardProvider } from '#components/context';
import { ThemeColorsPreset, themeController } from 'xtreme-ui';
import PageContainer from './_homepage/PageContainer';

export default function Homepage () {
	return (
		<>
			<head>
				<script dangerouslySetInnerHTML={{ __html: themeController('auto', ThemeColorsPreset.plum) }} suppressHydrationWarning />
			</head>
			<body>
				<DashboardProvider>
					<PageContainer />
				</DashboardProvider>
			</body>
		</>
	);
}
