import { useEffect, useState, useCallback, MouseEvent, Dispatch, SetStateAction } from 'react';

import { useRouter } from 'next/navigation';
import { Button } from 'xtreme-ui';

import { scrollToSection } from '#utils/helper/common';

import './landingSection.scss';

const imagesCount = 2;
const maxBlurPerImage = 60 / imagesCount;
const maxOverlayTranslate = 0.3;
const LandingSection = () => {
	const router = useRouter();
	const [background, setBackground] = useState('');
	const [blurBackground, setBlurBackground] = useState<number>(maxBlurPerImage);

	const [overlay, setOverlay] = useState('');
	const [blurOverlay, setBlurOverlay] = useState<number>(maxBlurPerImage);
	const [overlayX, setOverlayX] = useState(0);
	const [overlayY, setOverlayY] = useState(0);

	const fetchImages = useCallback((image: string, setBlur: Dispatch<SetStateAction<number>>, setImage: Dispatch<SetStateAction<string>>) => {
		const xmlHTTP = new XMLHttpRequest();

		Image.prototype.fetch = function (url: string) {
			const thisImg = this;

			xmlHTTP.open('GET', url, true);
			xmlHTTP.responseType = 'arraybuffer';
			xmlHTTP.onload = function () {
				const blob = new Blob([this.response]);
				thisImg.src = window.URL.createObjectURL(blob);
				setImage(thisImg.src);
				setBlur(0);
			};
			xmlHTTP.onprogress = function (event) {
				thisImg.loadFraction = event.loaded / event.total;
				setBlur((blur) => maxBlurPerImage - ((blur - 4) * thisImg.loadFraction));
			};
			xmlHTTP.onloadstart = function () {
				thisImg.loadPercent = 0;
			};
			xmlHTTP.send();
		};

		new Image().fetch(image);
	}, []);

	const onMouseMove = (event: MouseEvent) => {
		const target = event.target as HTMLDivElement;
		const width = target.clientWidth / 2;
		const height = target.clientHeight / 2;

		setOverlayX(maxOverlayTranslate * ((event.pageX - width) / width));
		setOverlayY(maxOverlayTranslate * ((event.pageY - height) / height));
	};

	useEffect(() => {
		fetchImages('/backgrounds/landingCover.png', setBlurBackground, setBackground);
		fetchImages('/backgrounds/landingCoverOverlay.png', setBlurOverlay, setOverlay);
	}, [fetchImages]);

	return (
		<section className='landingSection' id='homepage'
			style={{ filter: `blur(${blurBackground + blurOverlay}px)` }}
		>
			{ background && <div className='coverBackground' style={{ backgroundImage: `url(${background})` }} /> }
			{
				background && overlay &&
				<div className='coverOverlay' onMouseMove={onMouseMove} style={{
					backgroundImage: `url(${overlay})`,
					transform: `translate(${overlayX}%, ${overlayY}%)`,
				}}
				/>
			}
			<div className='overlay' />
			<div className='landingGreeting'>
				<p className='head'>Revolutionizing</p>
				<p className='subHead'>Dining Experience</p>
				<p className='desc'>Gone are the days of complex ordering systems and outdated</p>
				<p className='desc'>paper menus. It&apos;s time for the new normal, OrderWorder</p>
				<div className='greetingAction'>
					<Button label='Learn more' type='secondary' onClick={() => scrollToSection('homepage-aboutus')} />
					<Button label='Order now' onClick={() => router.push('/scan')} />
				</div>
			</div>
		</section>
	);
};

export default LandingSection;
