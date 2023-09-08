'use client';

import { useEffect } from 'react';

import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import { Button, useXData } from 'xtreme-ui';

import { SIDER_ROUTES } from '#utils/constants/routes';

import styles from './header.module.scss';

export default function Header () {
	const { siderMode, setSiderMode } = useXData();
	const pathname = usePathname();

	const title = SIDER_ROUTES.find(({ href }) => href === pathname)?.name;

	useEffect(() => {
		document.title = `Profile ⌘ ${title}`;
	}, [title]);

	return (
		<header className={clsx(styles.header, siderMode === 'left' && styles.siderOpen)}>
			<Button
				className={styles.hamburger}
				icon={siderMode === 'left' ? 'f053' : 'f550'}
				iconType='solid'
				onClick={() => setSiderMode(siderMode === 'left' ? 'closed' : 'left')}
			/>
			<p className={styles.title}>{title}</p>
		</header>
	);
}
