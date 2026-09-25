import _mongoose, { connect } from "mongoose";

declare global {
	declare module "*.svg" {
		import { FC, SVGProps } from "react";

		const SVG: FC<SVGProps<SVGSVGElement>>;
		export default SVG;
	}

	interface NextResponseError {
		message: string;
		status: number;
	}

	// eslint-disable-next-line no-var
	var mongoose: {
		promise: ReturnType<undefined | typeof connect>;
		conn: typeof _mongoose | null;
	};
}

// gliff's Icon dropped the size prop; it reads this CSS variable instead
declare module "react" {
	interface CSSProperties {
		"--iconSize"?: string;
	}
}
