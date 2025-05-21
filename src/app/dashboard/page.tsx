import { capitalize } from 'xtreme-ui';

import { DashboardProvider } from '#components/context';
import NavSideBar from '#components/layout/NavSideBar';

import PageContainer from './_components/PageContainer';
import './dashboard.scss';

const navItems = [
	{ label: 'orders', icon: 'e43b', value: 'orders' },
	{ label: 'settings', icon: 'f013', value: 'settings' },
];

export async function generateMetadata ({ searchParams }: IMetaDataProps) {
	const subTab = searchParams.subTab;
	return {
		title: `OrderWorder${subTab ? ` • ${capitalize(subTab)}` : ''}`,
	};
}

const Dashboard = () => {
	return (
		<DashboardProvider>
			<div className='dashboard'>
				<NavSideBar navItems={navItems} defaultTab='orders' foot />
				<PageContainer />
			</div>
		</DashboardProvider>
	);
};

export default Dashboard;

interface IMetaDataProps {
	params: {
		restaurant: string;
	};
	searchParams: {
		tab?: string;
		[key: string]: string | undefined;
	};
}
