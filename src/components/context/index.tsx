'use client';

import { ReactNode } from 'react';

import { SessionProvider } from 'next-auth/react';
import { XProvider } from 'xtreme-ui';

import { ModalProvider } from './Modal';
import { ProfileProvider } from './Profile';

const GlobalProvider = ({ children }: GlobalProviderProps) => {
	return (
		<XProvider>
			<SessionProvider>
				<ProfileProvider>
					<ModalProvider>
						{children}
					</ModalProvider>
				</ProfileProvider>
			</SessionProvider>
		</XProvider>
	);
};

export default GlobalProvider;
interface GlobalProviderProps {
    children?: ReactNode
}
