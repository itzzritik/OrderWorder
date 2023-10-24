import { Lottie } from 'xtreme-ui';

import { getAnimSrc } from '#utils/constants/common';

import './underConstruction.scss';

export default function UnderConstruction (props: IUnderConstructionProps) {
	const { className, message } = props;

	return (
		<div className={`underConstruction ${className ? className : ''}`}>
			<Lottie className='animation' src={getAnimSrc('UnderConstruction')} />
			<h1>Under Construction!</h1>
			<p>{message ? message : 'This page is under development!'}</p>
		</div>
	);
}

interface IUnderConstructionProps {
	className?: string;
	message?: string;
}
