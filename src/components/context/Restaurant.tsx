import { createContext, ReactNode } from 'react';

import { usePathname } from 'next/navigation';
import useSWR from 'swr';

import { TAccount } from '#utils/database/models/account';
import { fetcher } from '#utils/helper/common';

const RestaurantDefault: TRestaurantInitialType = {
	restaurant: undefined,
	error: undefined,
	loading: false,
};

export const RestaurantContext = createContext(RestaurantDefault);
export const RestaurantProvider = ({ children }: TRestaurantProviderProps) => {
	const pathname = usePathname();
	const { data: restaurant, error, isLoading } = useSWR(`/api/menu?id=${pathname.replace('/', '')}`, fetcher);

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
