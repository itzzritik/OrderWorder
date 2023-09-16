import _mongoose, { connect } from 'mongoose';

declare global {
	declare module '*.svg' {
		import { FC, SVGProps } from 'react';

		const SVG: FC<SVGProps<SVGSVGElement>>;
		export default SVG;
	}

	interface NextResponseError {
		status: number;
		message: string;
	}

	interface Global {
		mongoose: {
			promise: ReturnType<typeof connect> | null;
			conn: typeof _mongoose | null;
		}
	}

	let mongoose: {
		promise: ReturnType<typeof connect> | null;
		conn: typeof _mongoose | null;
	};
}
