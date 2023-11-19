'use client';

import { useRouter } from 'next/navigation';
import { QrReader } from 'react-qr-reader';

import './scan.scss';

const Scanner = () => {
	const router = useRouter();

	return (
		<div className='scanner'>
			<h4 className='brandLogo'>Order Worder</h4>
			<QrReader
				className='scannerPreview'
				constraints={{ facingMode: 'environment' }}
				scanDelay={300}
				onResult={(result, error) => {
					const url = result?.getText()?.toLowerCase();
					if (!url && !url?.includes(window.location.hostname)) return;
					if (error) return;

					router.replace(url.substring(url.indexOf('/', url.indexOf('://') + 3)));
				}}
			/>
			<p className='scannerDescription'>Please scan QR code on Your table</p>
		</div>
	);
};

export default Scanner;
