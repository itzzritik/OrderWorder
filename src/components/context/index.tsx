"use client";

import { SessionProvider } from "next-auth/react";
import { type ReactNode, Suspense } from "react";
import { XProvider } from "xtreme-ui";

import { ToastManager } from "#components/base/ToastManager";

import { AdminProvider } from "./Admin";
import { OrderProvider } from "./Order";
import { RestaurantProvider } from "./Restaurant";

export const GlobalProvider = ({ children }: ProviderProps) => (
	<XProvider>
		<SessionProvider>
			<Suspense>{children}</Suspense>
		</SessionProvider>
	</XProvider>
);

export const CustomerProvider = ({ children }: ProviderProps) => (
	<RestaurantProvider>
		<ToastManager />
		<OrderProvider>{children}</OrderProvider>
	</RestaurantProvider>
);

export const DashboardProvider = ({ children }: ProviderProps) => (
	<AdminProvider>
		<ToastManager />
		{children}
	</AdminProvider>
);
interface ProviderProps {
	children?: ReactNode;
}
