'use client';

import { ReactNode } from 'react';

import { SessionProvider } from 'next-auth/react';
import { XProvider } from 'xtreme-ui';

import { OrderProvider } from './Order';
import { RestaurantProvider } from './Restaurant';

const GlobalProvider = ({ children }: GlobalProviderProps) => {
	return (
		<XProvider>
			<SessionProvider>
				<RestaurantProvider>
					<OrderProvider>
						{children}
					</OrderProvider>
				</RestaurantProvider>
			</SessionProvider>
		</XProvider>
	);
};

export default GlobalProvider;
interface GlobalProviderProps {
    children?: ReactNode
}
