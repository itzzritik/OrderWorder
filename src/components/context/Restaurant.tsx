import { useState, createContext, ReactNode } from 'react';

import { usePathname } from 'next/navigation';

import { TAccount } from '#utils/database/models/account';

const RestaurantDefault: TRestaurantInitialType = {
	restaurant: undefined,
	fetchMenu: () => null,
};

export const RestaurantContext = createContext(RestaurantDefault);
export const RestaurantProvider = ({ children }: TRestaurantProviderProps) => {
	const pathname = usePathname();
	const [restaurant, setRestaurant] = useState(RestaurantDefault.restaurant);

	const fetchMenu = async () => {
		const req = await fetch(`/api/menu?id=${pathname.replace('/', '')}`);
		const data = await req.json();
		setRestaurant(data);
	};

	return (
		<RestaurantContext.Provider value={{ restaurant, fetchMenu }}>
			{children}
		</RestaurantContext.Provider>
	);
};

export type TRestaurantProviderProps = {
    children?: ReactNode
}

export type TRestaurantInitialType = {
	restaurant?: TAccount,
	fetchMenu: () => void
}
