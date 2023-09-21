'use client';

import { ReactNode } from 'react';

import { SessionProvider } from 'next-auth/react';
import { XProvider } from 'xtreme-ui';

import { RestaurantProvider } from './Restaurant';

const GlobalProvider = ({ children }: GlobalProviderProps) => {
	return (
		<XProvider>
			<SessionProvider>
				<RestaurantProvider>
					{children}
				</RestaurantProvider>
			</SessionProvider>
		</XProvider>
	);
};

export default GlobalProvider;
interface GlobalProviderProps {
    children?: ReactNode
}
