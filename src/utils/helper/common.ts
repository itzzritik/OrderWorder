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
