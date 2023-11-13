import React, { ReactNode } from 'react';

import clsx from 'clsx';
import { Icon } from 'xtreme-ui';

import './collapsible.scss';

const Collapsible = (props: TCollapsibleProps) => {
	const { className, children, expand, setExpand, label, alert } = props;

	const classList = clsx(
		'collapsible',
		className,
		expand && 'expand',
	);

	return (
		<div className={classList}>
			<div className='collapsibleHeader' onClick={() => setExpand(!expand)}>
				<p className='label'>{label}</p>
				{alert && <span className='alertLabel'>{alert}</span>}
				<Icon code='f063' />
			</div>
			<div className='collapsibleContent'>
				{expand && children}
			</div>
		</div>
	);
};

export default Collapsible;

type TCollapsibleProps = {
	className?: string
	children: ReactNode
	expand: boolean
	setExpand: (expand: boolean) => void
	label: string
	alert?: number
}
