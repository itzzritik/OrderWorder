'use client';

import { ReactNode } from 'react';

import { SessionProvider } from 'next-auth/react';
import { XProvider } from 'xtreme-ui';

const GlobalProvider = ({ children }: GlobalProviderProps) => {
	return (
		<XProvider>
			<SessionProvider>
				{children}
			</SessionProvider>
		</XProvider>
	);
};

export default GlobalProvider;
interface GlobalProviderProps {
    children?: ReactNode
}
