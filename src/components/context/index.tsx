/* eslint-disable react/no-danger */
'use client';

import { ReactNode } from 'react';

import { SessionProvider } from 'next-auth/react';
import { XProvider, themeController } from 'xtreme-ui';

import { ThemeManager } from '#components/base/ThemeManager';

import { AdminProvider } from './Admin';
import { OrderProvider } from './Order';
import { RestaurantProvider } from './Restaurant';

export const GlobalProvider = ({ children }: ProviderProps) => {
	return (
		<XProvider>
			<SessionProvider>
				<script dangerouslySetInnerHTML={{ __html: themeController(undefined, 'black') }} />
				{children}
			</SessionProvider>
		</XProvider>
	);
};

export const CustomerProvider = ({ children }: ProviderProps) => {
	return (
		<RestaurantProvider>
			<ThemeManager />
			<OrderProvider>
				{children}
			</OrderProvider>
		</RestaurantProvider>
	);
};

export const DashboardProvider = ({ children }: ProviderProps) => {
	return (
		<AdminProvider>
			<ThemeManager />
			{children}
		</AdminProvider>
	);
};
interface ProviderProps {
    children?: ReactNode
}
