import type { ReactNode } from "react";
import { Gliff } from "xtreme-ui";
import { GlobalProvider } from "#components/context";
import { montserrat } from "#utils/helper/fontHelper";
import "./globals.scss";

export const metadata = {
	title: "OrderWorder",
};
export default function RootLayout({ children }: IRootProps) {
	return (
		<html lang="en" className={montserrat.variable} suppressHydrationWarning>
			<head>
				<Gliff next />
			</head>
			<GlobalProvider>{children}</GlobalProvider>
		</html>
	);
}

interface IRootProps {
	children?: ReactNode;
}
