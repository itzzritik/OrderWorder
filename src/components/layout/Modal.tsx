import { ReactNode } from 'react';

import clsx from 'clsx';
import { Button } from 'xtreme-ui';

import './modal.scss';

const Modal = (props: TModal) => {
	const { children, open, setOpen, closeIcon = 'e59b' } = props;
	const classList = clsx(
		'modal',
		open && 'open',
	);

	return (
		<div className={classList}>
			<div className='backdrop' onClick={() => setOpen(false)} />
			<div className='modalPane'>
				{children}
				{ closeIcon && <Button className='closeModal' size='mini' icon={closeIcon} onClick={() => setOpen(false)} /> }
			</div>
		</div>
	);
};

export default Modal;

type TModal = {
	open: boolean;
	closeIcon?: string;
	setOpen: (open: boolean) => void
	children: ReactNode;
}
