import { useEffect, useState, MouseEvent, Dispatch, SetStateAction, useRef } from 'react';

import { useRouter } from 'next/navigation';
import { Button, useXTheme } from 'xtreme-ui';

import { scrollToSection } from '#utils/helper/common';

import './landingSection.scss';

import clsx from 'clsx';

const bgImg = '/backgrounds/landingCover.png';
const overlayImg = '/backgrounds/landingCoverOverlay.png';
const maxBlurPerImage = 30;
const maxOverlayTranslate = 0.3;
const LandingSection = () => {
	const router = useRouter();
	const { isDarkTheme } = useXTheme();
	const ref = useRef<HTMLDivElement>(null);
	const [blurBackground, setBlurBackground] = useState<number>(maxBlurPerImage);
	const [blurOverlay, setBlurOverlay] = useState<number>(maxBlurPerImage);

	const onMouseMove = (event: MouseEvent) => {
		const target = event.target as HTMLDivElement;
		const width = target.clientWidth / 2;
		const height = target.clientHeight / 2;

		const overlayX = maxOverlayTranslate * ((event.pageX - width) / width);
		const overlayY = maxOverlayTranslate * ((event.pageY - height) / height);
		if (ref?.current) ref.current.style.transform = `translate(${overlayX}%, ${overlayY}%)`;
	};

	useEffect(() => {
		const fetchImages = (src: string, setBlur: Dispatch<SetStateAction<number>>) => {
			const xhr = new XMLHttpRequest();
			xhr.open('GET', src, true);
			xhr.responseType = 'arraybuffer';
			xhr.onprogress = (event) => setBlur((blur) => maxBlurPerImage - ((blur - 4) * (event.loaded / event.total)));
			xhr.onload = () => setBlur(0);
			xhr.send();
		};

		fetchImages(bgImg, setBlurBackground);
		fetchImages(overlayImg, setBlurOverlay);
	}, []);

	return (
		<section className={clsx('landingSection', isDarkTheme && 'dark')} id='homepage'
			style={{ filter: `blur(${blurBackground + blurOverlay}px)` }}
		>
			<div className='coverBackground' style={{ backgroundImage: `url(${bgImg})` }} />
			<div ref={ref} className='coverOverlay' onMouseMove={onMouseMove} style={{ backgroundImage: `url(${overlayImg})` }} />
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
