import { getAnimSrc } from "#utils/constants/common";
import { Lottie } from "xtreme-ui";
import './kitchen.scss';

const Kitchen = () => {
	return (
		<div className='kitchen'>
			<Lottie src={getAnimSrc('UnderConstruction')} size={450} />
			<p>This page is under development</p>
		</div>
	)
}

export default Kitchen;