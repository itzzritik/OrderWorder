import { Lottie } from 'xtreme-ui';

import { getAnimSrc } from '#utils/constants/common';

import './featureSection.scss';

const FeatureList = ({ items }: { items: string[] }) => {
	const hues = Array(items.length).fill(0).map((_, i) => i * (360 / items.length)).sort(() => Math.random() - 0.5);
	const getHSL = (hue: number, light: number) => `hsl(${hue}, 70%, ${light}%)`;

	return items.map((item, i) => (
		<div className='featureListItem' key={i}
			style={{
				['--lightFeatureColor' as string]: getHSL(hues[i], 80),
				['--darkFeatureColor' as string]: getHSL(hues[i], 40) }
			}
		>
			<h1>{item.charAt(0)}</h1>
			<p>{item}</p>
		</div>
	));
};
const FeatureSection = () => {
	return (
		<section className='featureSection' id='homepage-features'>
			<div className='featuresContent'>
				<h2>Features</h2>
				<FeatureList items={[
					'Bring down your operating and logistics cost',
					'Eliminate any third parties between your customer and kitchen',
					'Track history of all your customer orders',
					'Time to get a professional edge',
					'Enhance the dining experience for your own customers',
					'Remove any scope of human error in your restaurant management',
				]}
				/>
			</div>
			<div className='featuresAnim'>
				<Lottie className='whyUsAnim' src={getAnimSrc('FoodMeal')} speed={0.5} />
			</div>
		</section>
	);
};

export default FeatureSection;
