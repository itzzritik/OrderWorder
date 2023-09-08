'use client';

import { useState, createContext, ReactNode, useEffect } from 'react';

import { usePathname } from 'next/navigation';

import { SIDER_ROUTES_HREF } from '#utils/constants/routes';
import { TProfile } from '#utils/github/getProfile';

const ProfileDefault: ProfileDefaultType = {
	profile: undefined,
	createProfile: () => {},
};

const ProfileContext = createContext(ProfileDefault);
const ProfileProvider = ({ children }: ProfileProviderProps) => {
	const pathname = usePathname();
	const [createProfileRequired, setCreateProfileRequired] = useState<boolean>();
	const [profile, setProfile] = useState<TProfile>();

	const createProfile = async () => {
		const res = await fetch('/api/github/createProfile');
		const data = await res.json();
		setProfile(data);
		setCreateProfileRequired(false);
	};

	useEffect(() => {
		fetch('/api/github/getProfile')
			.then((res) => {
				if (res.status == 404 && SIDER_ROUTES_HREF.includes(pathname))
					return setCreateProfileRequired(true);

				return res.json();
			})
			.then((data) => {
				if (typeof data !== 'object')
					return setCreateProfileRequired(true);

				setCreateProfileRequired(false);
				setProfile(data);
			});
	}, [pathname, createProfileRequired]);

	return (
		<ProfileContext.Provider value={{ profile, createProfileRequired, createProfile }}>
			{ children }
		</ProfileContext.Provider>
	);
};

export { ProfileContext, ProfileProvider };
export interface ProfileDefaultType {
	profile?: TProfile
	createProfileRequired?: boolean
	createProfile: () => void
}
interface ProfileProviderProps {
    children?: ReactNode
}
