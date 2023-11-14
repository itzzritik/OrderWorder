'use client';

import { ReactNode } from 'react';

import { SessionProvider } from 'next-auth/react';
import { XProvider } from 'xtreme-ui';

import { AdminOrderProvider } from './AdminOrder';
import { OrderProvider } from './Order';
import { RestaurantProvider } from './Restaurant';

export const GlobalProvider = ({ children }: ProviderProps) => {
	return (
		<XProvider>
			<SessionProvider>
				{children}
			</SessionProvider>
		</XProvider>
	);
};

export const CustomerProvider = ({ children }: ProviderProps) => {
	return (
		<RestaurantProvider>
			<OrderProvider>
				{children}
			</OrderProvider>
		</RestaurantProvider>
	);
};

export const AdminProvider = ({ children }: ProviderProps) => {
	return (
		<AdminOrderProvider>
			{children}
		</AdminOrderProvider>
	);
};
interface ProviderProps {
    children?: ReactNode
}
