const cacheBuster = process.env.NODE_ENV !== 'production' ? `?v=${Date.now()}` : '';

const ASSETS = 'https://cdn.jsdelivr.net/gh/itzzjarvis/Assets@main';
const cssList = [
	'/styles/fa/fa-min.css',
];

const cssUrls = cssList.map((path) => `${ASSETS}${path}${cacheBuster}`);

export default function PreloadCss() {
	return cssUrls.map((href) => [
		<link key={href + '-preload'} as='style' href={href} rel='preload' />,
		<link key={href} href={href} rel='stylesheet' />,
	]);
}
