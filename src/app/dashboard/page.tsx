import { capitalize } from "xtreme-ui";

import { DashboardProvider } from "#components/context";
import NavSideBar from "#components/layout/NavSideBar";

import PageContainer from "./_components/PageContainer";
import "./dashboard.scss";

const navItems = [
	{ label: "orders", icon: "e43b", value: "orders" },
	{ label: "settings", icon: "f013", value: "settings" },
];

export async function generateMetadata({ searchParams }: IMetaDataProps) {
	const s = await searchParams;
	return {
		title: `OrderWorder${s.tab ? ` • ${capitalize(s.tab)}` : ""}`,
	};
}

const Dashboard = () => (
	<DashboardProvider>
		<div className="dashboard">
			<NavSideBar defaultTab="orders" foot navItems={navItems} />
			<PageContainer />
		</div>
	</DashboardProvider>
);

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
