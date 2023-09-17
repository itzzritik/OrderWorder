import { NextResponse } from 'next/server';

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
