import { Lottie } from 'xtreme-ui';

import { getAnimSrc } from '#utils/constants/common';

import './noContent.scss';

const NoContent = (props: TNoContentProps) => {
	const { label } = props;
	return (
		<div className='noContent'>
			<div>
				<Lottie size={250} src={getAnimSrc('FoodBurgerHappy')} speed={0.7} />
				{label && <p>{label}</p>}
			</div>
		</div>
	);
};

export default NoContent;

export type TNoContentProps = {
	label: string,
}
