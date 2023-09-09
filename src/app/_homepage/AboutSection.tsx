import { Button, Lottie } from 'xtreme-ui';

import { getAnimSrc } from '#utils/constants/common';
import { scrollToSection } from '#utils/helper/common';

import './aboutSection.scss';

const AboutSection = () => {
	return (
		<section className='aboutSection' id='homepage-aboutus'>
			<div className='aboutContent'>
				<h2>About us</h2>
				<p>
					We are a team of highly motivated revolutionaries, dedicated
					towards revolutionizing the restaurant industry by
					transforming the way your customers order at your restaurant
					- by going contactless and paperless.
				</p>
				<p>
					It&apos;s time to bridge the gap between your customers and your
					kitchen, in an efficient, proficient and affordable way,
					with us.
				</p>
				<div className='aboutAction'>
					<Button label='Learn more' onClick={() => scrollToSection('homepage-features')} />
					<Button label='Why us?' type='secondary' onClick={() => scrollToSection('homepage-features')} />
				</div>
			</div>
			<div className='aboutAnim'>
				<Lottie className='scanMenuAnim' src={getAnimSrc('FoodScanMenu')} speed={0.8} />
			</div>
		</section>
	);
};

export default AboutSection;
