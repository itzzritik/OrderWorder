import { createContext, ReactNode, useMemo } from 'react';

import { usePathname } from 'next/navigation';
import useSWR from 'swr';

import { TAccount } from '#utils/database/models/account';

const RestaurantDefault: TRestaurantInitialType = {
	restaurant: undefined,
	error: undefined,
	loading: false,
};

export const RestaurantContext = createContext(RestaurantDefault);
export const RestaurantProvider = ({ children }: TRestaurantProviderProps) => {
	const pathname = usePathname();
	const { data, error, isLoading } = useSWR(`/api/menu?id=${pathname.replace('/', '')}`);

	const restaurant = useMemo(() => {
		if (!data?.profile?.categories.includes('all')) data?.profile?.categories?.unshift('all');
		return data;
	}, [data]);

	return (
		<RestaurantContext.Provider value={{ restaurant, error, loading: isLoading }}>
			{children}
		</RestaurantContext.Provider>
	);
};

export type TRestaurantProviderProps = {
    children?: ReactNode
}

export type TRestaurantInitialType = {
	restaurant?: TAccount,
	error: unknown,
	loading: boolean,
}
