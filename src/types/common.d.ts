import _mongoose, { connect } from 'mongoose';

declare global {
	var themeColors: Map<string, TThemeColor | null>;
	declare module '*.svg' {
		import { FC, SVGProps } from 'react';

		const SVG: FC<SVGProps<SVGSVGElement>>;
		export default SVG;
	}

	interface NextResponseError {
		status: number;
		message: string;
	}

	// eslint-disable-next-line no-var
	var mongoose: {
		promise: ReturnType<void | typeof connect>;
		conn: typeof _mongoose | null;
	};
}
