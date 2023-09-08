import { useContext } from 'react';

import { ModalContext, ModalDefaultType } from './Modal';
import { ProfileContext, ProfileDefaultType } from './Profile';

export const useProfile = (): ProfileDefaultType => useContext(ProfileContext);
export const useModal = (): ModalDefaultType => useContext(ModalContext);
