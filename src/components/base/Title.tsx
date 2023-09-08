'use client';

import { useEffect } from 'react';

export default function Title () {

	useEffect(() => {
		document.title = 'OrderWorder⌘';
	}, []);

	return null;
}
