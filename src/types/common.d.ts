export declare global {
	declare module '*.svg' {
		import { FC, SVGProps } from 'react';

		const SVG: FC<SVGProps<SVGSVGElement>>;
		export default SVG;
	}

	interface NextResponseError {
		status: number;
		message: string;
	}
}
