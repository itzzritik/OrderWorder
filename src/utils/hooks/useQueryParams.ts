import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { createQueryString } from '#utils/helper/common';

export const useQueryParams = () => {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const router = useRouter();

	return {
		pathname,
		router,
		get: (v: string) => searchParams.get(v),
		set: (query: Record<string, string>) => {
			router.replace(pathname + '?' + createQueryString(searchParams, query));
		},
	};
};
