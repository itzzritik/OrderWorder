import { useState, useEffect } from 'react';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from 'xtreme-ui';

import { splitStringByFirstWord } from '#utils/helper/common';

import PasswordSettings from './PasswordSettings';
import './settingsAccount.scss';

const SettingsAccount = () => {
	const router = useRouter();
	const session = useSession();
	const [restaurantName, setRestaurantName] = useState<string[]>([]);

	useEffect(() => {
		if (session?.data?.profile?.name) {
			setRestaurantName(splitStringByFirstWord(session?.data?.profile?.name) ?? []);
		}
	}, [session?.data?.profile?.name]);

	return (
		<div className='settingsAccount'>
			<div className='profileSettingsCard'>
				<div className='restaurantDetails'>
					<h1 className='name'>{restaurantName[0]} <span>{restaurantName[1]}</span></h1>
					<h6 className='address'>{session?.data?.profile?.address}</h6>
				</div>
				<Button
					className='logout'
					icon='f011'
					label='Sign out'
					onClick={() => router.push('/logout')}
				/>
			</div>
			<PasswordSettings />
			{/* <ThemeSettings mainColor={props?.restaurant?.themeColor} /> */}
		</div>
	);
};

export default SettingsAccount;
