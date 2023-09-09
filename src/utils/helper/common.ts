import { NextResponse } from 'next/server';

export const CatchNextResponse = ({ message = 'Something went wrong', status = 500 }: NextResponseError) => {
	return NextResponse.json(
		{ message, status },
		{ status },
	);
};

export const scrollToSection = (section: string) => {
	setTimeout(() => {
		const element = document.querySelector(`#${section ? section : 'home'}`) as HTMLDivElement;
		window.scrollTo(0, element?.offsetTop);
	}, 0);
};
