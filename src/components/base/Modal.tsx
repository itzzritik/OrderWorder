import React, { ReactNode } from 'react';

import clsx from 'clsx';
import { Button } from 'xtreme-ui';

const Modal = (props: TModal) => {
	const { children, open, setOpen, closeIcon = 'f00d' } = props;
	const classList = clsx(
		'modal',
		open && 'open',
	);

	return (
		<div className={classList}>
			<div className='backdrop' onClick={() => setOpen(false)} />
			<div className='modalPane'>
				{children}
				{ closeIcon && <Button className='closeModal' icon={closeIcon} onClick={() => setOpen(false)} /> }
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
