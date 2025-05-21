/* eslint-disable react/no-danger */
import { ReactNode } from 'react';

import { GlobalProvider } from '#components/context';
import { montserrat } from '#utils/helper/fontHelper';

import './globals.scss';

export const metadata = {
	title: 'OrderWorder',
};
export default function RootLayout ({ children }: IRootProps) {
	return (
		<html lang='en' className={montserrat.variable} suppressHydrationWarning>
			<GlobalProvider>
				{ children }
			</GlobalProvider>
		</html>
	);
}

interface IRootProps {
	children?: ReactNode;
}
