import { useState, useEffect } from 'react';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Avatar, Button, Spinner } from 'xtreme-ui';

import { useAdmin } from '#components/context/useContext';
import { splitStringByFirstWord } from '#utils/helper/common';

import PasswordSettings from './PasswordSettings';
import ThemeSettings from './ThemeSettings';
import './settingsAccount.scss';

const SettingsAccount = () => {
	const router = useRouter();
	const { profile } = useAdmin();
	const session = useSession();
	const [restaurantName, setRestaurantName] = useState<string[]>([]);

	useEffect(() => {
		if (profile?.name)
			setRestaurantName(splitStringByFirstWord(profile?.name) ?? []);
	}, [profile?.name]);

	if (session.status === 'loading' || !profile) return <Spinner fullpage label='Loading Account...' />;

	return (
		<div className='settingsAccount'>
			<div className='profileSettingsCard'>
				{profile?.avatar && <Avatar className='avatar' src={profile?.avatar} />}
				<div className='restaurantDetails'>
					<h1 className='name'>{restaurantName[0]} <span>{restaurantName[1]}</span></h1>
					<h6 className='address'>{profile?.address}</h6>
				</div>
				<Button
					className='logout'
					icon='f011'
					onClick={() => router.push('/logout')}
				/>
			</div>
			<PasswordSettings />
			<ThemeSettings />
		</div>
	);
};

export default SettingsAccount;
