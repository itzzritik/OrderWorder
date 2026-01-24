import { Lottie } from "xtreme-ui";

import { getAnimSrc } from "#utils/constants/common";

import "./kitchen.scss";

const Kitchen = () => {
	return (
		<div className="kitchen">
			{/* TODO: Re-enable Lottie when xtreme-ui is compatible with React 19 / build setup.
			    Currently causes prerender error: TypeError: (0 , g.useState) is not a function
			<Lottie src={getAnimSrc("UnderConstruction")} size={450} /> */}
			<p>This page is under development</p>
		</div>
	);
};

export default Kitchen;
