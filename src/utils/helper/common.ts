import forEach from 'lodash/forEach';
import { ReadonlyURLSearchParams } from 'next/navigation';
import { NextResponse } from 'next/server';

import { TThemeColor } from '#utils/database/models/profile';

export const fetcher = (url: string) => fetch(url).then((r) => r.json());
export const CatchNextResponse = ({ message = 'Something went wrong', status = 500 }: NextResponseError) => {
	return NextResponse.json(
		{ message, status },
		{ status },
	);
};

export const scrollToSection = (section?: string) => {
	const element = document.getElementById(section ? section : 'homepage') as HTMLDivElement;
	element.scrollIntoView({ behavior: 'smooth' });
};

export const isEmailValid = (email?: string) => {
	const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
	return emailPattern.test(email ?? '');
};

export const createQueryString = (searchParams: ReadonlyURLSearchParams, query: Record<string, string>) => {
	const params = new URLSearchParams(searchParams);
	forEach(query, (value, key) => params.set(key, value));
	return params.toString();
};

export const splitStringByFirstWord = (sentence: string) => {
	if (!sentence) {
		return;
	}

	sentence = sentence.trim();
	return [
		sentence.replace(/ .*/, ''),	// Get first word from sentence
		sentence.replace(/\w+ /, ''),	// Get remaining sentence except first word
	];
};

export const isValidRGB = (color?: TThemeColor) => {
	if (!color) return false;
	return color?.r >= 0 && color?.r <= 255 &&
		color?.g >= 0 && color?.g <= 255 &&
		color?.b >= 0 && color?.b <= 255;
};
export const isEqualColor = (color1?: TThemeColor, color2?: TThemeColor) => {
	return color1?.r === color2?.r && color1?.g === color2?.g && color1?.b === color2?.b;
};
