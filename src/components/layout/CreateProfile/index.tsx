import { useState } from 'react';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button, Lottie } from 'xtreme-ui';

import { useProfile } from '#components/context/useContext';
import { getAnimSrc } from '#utils/constants/common';

import styles from './createProfile.module.scss';

export default function CreateProfile () {
	const router = useRouter();
	const session = useSession();
	const { createProfile } = useProfile();
	const [loading, setLoading] = useState<TControlLoading>();

	const onCreate = () => {
		setLoading('create');
		createProfile();
	};

	const onLogout = () => {
		setLoading('logout');
		router.replace('/logout');
	};

	return (
		<div className={styles.createProfile} role='dialog'>
			<Lottie className={styles.animation} src={getAnimSrc('HelloColorfull')} size={500} />
			<div className={styles.dialog}>
				<h3 className={styles.title}>Welcome to your profile</h3>
				<p className={styles.subtitle}>Since this is your first login, It is crucial to set up your GitHub profile.</p>
				<p className={styles.subtitle}>This process includes the automatic creation of a repository named
					<span className={styles.repoName}> {session?.data?.user?.social?.github}</span>
				</p>
				<p className={styles.subtitle}>which will be your dedicated space for Profile data and preferences</p>
				<div className={styles.controls}>
					<Button size='mini' label='Sure, Create It' loading={loading === 'create'} onClick={onCreate} />
					<Button size='mini' type='primaryDanger' label='No, Logout!' loading={loading === 'logout'} onClick={onLogout} />
				</div>
			</div>
		</div>
	);
}

type TControlLoading = 'create' | 'logout';
