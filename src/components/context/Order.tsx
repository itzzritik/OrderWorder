import { createContext, ReactNode, useMemo } from 'react';

import { usePathname } from 'next/navigation';
import useSWR from 'swr';

import { TAccount } from '#utils/database/models/account';
import { fetcher } from '#utils/helper/common';

const OrderDefault: TOrderInitialType = {
	order: undefined,
	error: undefined,
	loading: false,
};

export const OrderContext = createContext(OrderDefault);
export const OrderProvider = ({ children }: TOrderProviderProps) => {
	const pathname = usePathname();
	const { data, error, isLoading } = useSWR(`/api/menu?id=${pathname.replace('/', '')}`, fetcher);

	const order = useMemo(() => {
		if (!data?.profile?.categories.includes('all')) data?.profile?.categories?.unshift('all');
		return data;
	}, [data]);

	return (
		<OrderContext.Provider value={{ order, error, loading: isLoading }}>
			{children}
		</OrderContext.Provider>
	);
};

export type TOrderProviderProps = {
    children?: ReactNode
}

export type TOrderInitialType = {
	order?: TAccount,
	error: unknown,
	loading: boolean,
}
