'use client';

import { useState, createContext, ReactNode, useEffect } from 'react';

import { useXData } from 'xtreme-ui';

import { Academics, SocialHandles } from '#utils/github/getProfile';

const ModalDefault: ModalDefaultType = {
	setSocialModal: () => {},
	setAcademicsModal: () => {},
};

const ModalContext = createContext(ModalDefault);
const ModalProvider = ({ children }: ModalProviderProps) => {
	const { siderMode, setSiderMode } = useXData();
	const [socialModal, setSocialModal] = useState<TSocialModal>();
	const [academicsModal, setAcademicsModal] = useState<TAcademicsModal>();

	useEffect(() => {
		if (socialModal?.mode || academicsModal?.mode) setSiderMode('right');
	}, [socialModal, academicsModal, setSiderMode]);

	useEffect(() => {
		if (siderMode === 'closed') {
			setTimeout(() => {
				setSocialModal(undefined);
				setAcademicsModal(undefined);
			}, 600);
		}
	}, [siderMode]);

	return (
		<ModalContext.Provider value={{
			socialModal, setSocialModal,
			academicsModal, setAcademicsModal,
		}}
		>
			{ children }
		</ModalContext.Provider>
	);
};

export { ModalContext, ModalProvider };
export interface ModalDefaultType {
	socialModal?: TSocialModal
	academicsModal?: TAcademicsModal
	setSocialModal: (social: TSocialModal) => void,
	setAcademicsModal: (academics: TAcademicsModal) => void,
}
interface ModalProviderProps {
    children?: ReactNode
}

type ModalType<T> = T & { mode: 'create' | 'edit' };
type TSocialModal = ModalType<SocialHandles>;
type TAcademicsModal = ModalType<Academics>;
