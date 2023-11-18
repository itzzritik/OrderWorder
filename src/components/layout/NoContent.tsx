import { Lottie } from 'xtreme-ui';

import { getAnimSrc } from '#utils/constants/common';

import './noContent.scss';

const NoContent = (props: TNoContentProps) => {
	const { animationName, label, size = 250, speed } = props;
	return (
		<div className='noContent'>
			<div>
				<Lottie src={getAnimSrc(animationName)} size={size} speed={speed} />
				{label && <p>{label}</p>}
			</div>
		</div>
	);
};

export default NoContent;

export type TNoContentProps = {
	animationName: string,
	label: string,
	size?: number,
	speed?: number,
}
