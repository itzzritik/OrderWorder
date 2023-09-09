'use client';

import { useEffect } from 'react';

import { ToastContainer } from 'react-toastify';

export default function Title () {

	useEffect(() => {
		document.title = 'OrderWorder⌘';
	}, []);

	return (
		<>
			<ToastContainer />
		</>
	);
}
