'use client';

import { ReactNode } from 'react';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SimpleBar from 'simplebar-react';
import { Button, Navigation, Sider as XSider, useXData } from 'xtreme-ui';

import { useProfile } from '#components/context/useContext';
import { modalList } from '#utils/constants/modal';
import { SIDER_ROUTES, SIDER_ROUTES_HREF } from '#utils/constants/routes';

import CreateProfile from '../CreateProfile';
import Header from '../Header';

import styles from './sider.module.scss';

export default function Sider ({ children }: TSiderProps) {
	const pathname = usePathname();
	const { siderMode, setSiderMode } = useXData();
	const { createProfileRequired } = useProfile();

	const Modal = modalList[pathname as keyof typeof modalList];

	if (!SIDER_ROUTES_HREF.includes(pathname)) return children;

	return (
		<>
			<XSider
				className={styles.sider}
				showMiniLeftSider
				leftSider={
					<Navigation as={Link} pathname={pathname} routes={SIDER_ROUTES}>
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Jarvis
					</Navigation>
				}
				rightSider={
					Modal ? <Modal /> : null
				}
			>
				<SimpleBar className={styles.content}>
					<Header />
					{ children }
				</SimpleBar>
				<Button
					className={clsx(styles.add, siderMode === 'right' && styles.active)}
					icon={siderMode === 'right' ? 'f054' : '2b'}
					iconType='solid'
					onClick={() => setSiderMode(siderMode === 'right' ? 'closed' : 'right')}
				/>
			</XSider>
			{createProfileRequired === true && <CreateProfile />}
		</>
	);
}

type TSiderProps = {
	children: ReactNode;
};
