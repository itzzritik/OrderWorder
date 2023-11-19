import { ReactNode } from 'react';

import clsx from 'clsx';
import { Button } from 'xtreme-ui';

import './sideSheet.scss';

const SideSheet = (props: SideSheetProps) => {
	const { children, className, title, open, setOpen } = props;
	const classList = clsx('sideSheet', open && 'sideSheetOpen', className);

	return (
		<div className={classList}>
			<div className='backdrop' onClick={() => setOpen(false)} />
			<div className='sideContainer'>
				<div className='sheetHeader'>
					<h1 className='title'>{title[0]} <span>{title[1]}</span></h1>
					<Button icon='f00d' iconType='solid' size='mini' onClick={() => setOpen(false)} />
				</div>
				<div className='sheetContent'>{children}</div>
			</div>
		</div>
	);
};

export default SideSheet;

type SideSheetProps = {
	children: ReactNode,
	className?: string,
	title: string[],
	open: boolean,
	setOpen: (open: boolean) => void
}
