import type { Metadata } from "next";
import { capitalize } from "xtreme-ui";

import { ChatInterface } from "#components/chatbot/Chat";
import { CustomerProvider } from "#components/context";
import NavSideBar from "#components/layout/NavSideBar";
import JsonLd from "#components/seo/JsonLd";
import { getRestaurantProfile } from "#utils/database/helper/getRestaurantProfile";
import { SITE_NAME, SITE_URL } from "#utils/seo/constants";
import { buildMetadata } from "#utils/seo/metadata";

import PageContainer from "./_components/PageContainer";
import "./restaurant.scss";

const navItems = [
	{ label: "explore", value: "explore", icon: "f015" },
	{ label: "menu", value: "menu", icon: "e3e3" },
	{ label: "reviews", value: "reviews", icon: "f4ad" },
	{ label: "contact", value: "contact", icon: "f8d3" },
	{ label: "sign out", value: "signout", icon: "f011" },
];

export async function generateMetadata({ params }: IRestaurantProps): Promise<Metadata> {
	const { restaurant } = await params;
	const profile = await getRestaurantProfile(restaurant);
	const name = profile?.name ?? capitalize(restaurant);
	const description =
		profile?.description ?? `Order food online from ${name}. Browse the menu, customize your order, and enjoy contactless dining powered by ${SITE_NAME}.`;

	return buildMetadata({
		title: `${name} — Order Online`,
		description,
		path: `/${restaurant}`,
	});
}

const Restaurant = async ({ params }: IRestaurantProps) => {
	const { restaurant } = await params;
	const profile = await getRestaurantProfile(restaurant);
	const name = profile?.name ?? capitalize(restaurant);

	return (
		<CustomerProvider>
			<JsonLd
				data={{
					"@context": "https://schema.org",
					"@type": "Restaurant",
					name,
					url: `${SITE_URL}/${restaurant}`,
					...(profile?.description && { description: profile.description }),
					...(profile?.address && { address: { "@type": "PostalAddress", streetAddress: profile.address } }),
					...(profile?.cover && { image: profile.cover }),
					...(profile?.categories?.length && { servesCuisine: profile.categories }),
					hasMenu: { "@type": "Menu", url: `${SITE_URL}/${restaurant}?tab=menu` },
					potentialAction: {
						"@type": "OrderAction",
						target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/${restaurant}?tab=menu` },
					},
				}}
			/>
			<div className="restaurant">
				<NavSideBar navItems={navItems} defaultTab="menu" foot />
				<PageContainer />
				<ChatInterface />
			</div>
		</CustomerProvider>
	);
};

export default Restaurant;

interface IRestaurantProps {
	params: Promise<{ restaurant: string }>;
	searchParams: Promise<{ tab?: string; [key: string]: string | undefined }>;
}
