import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Gliff } from "xtreme-ui";
import { GlobalProvider } from "#components/context";
import { montserrat } from "#utils/helper/fontHelper";
import { SITE_DESCRIPTION, SITE_KEYWORDS, SITE_NAME, SITE_URL } from "#utils/seo/constants";
import "./globals.scss";

export const metadata: Metadata = {
	metadataBase: new URL(SITE_URL),
	title: {
		template: `%s | ${SITE_NAME}`,
		default: `${SITE_NAME} — Contactless Restaurant Ordering & AI-Powered Dining`,
	},
	description: SITE_DESCRIPTION,
	keywords: [...SITE_KEYWORDS],
	openGraph: {
		type: "website",
		locale: "en_US",
		siteName: SITE_NAME,
	},
	twitter: { card: "summary_large_image" },
	robots: {
		index: true,
		follow: true,
		"max-image-preview": "large",
		"max-snippet": -1,
		"max-video-preview": -1,
	},
};

export default function RootLayout({ children }: IRootProps) {
	return (
		<html lang="en" className={montserrat.variable} suppressHydrationWarning>
			<head>
				<Gliff next />
			</head>
			<body>
				<GlobalProvider>{children}</GlobalProvider>
			</body>
		</html>
	);
}

interface IRootProps {
	children?: ReactNode;
}
