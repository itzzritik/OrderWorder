import clsx from "clsx";
import type { ReactNode } from "react";
import { Icon } from "xtreme-ui";

import "./collapsible.scss";

const Collapsible = (props: TCollapsibleProps) => {
	const { className, children, round, expand, setExpand, label, alert } = props;

	const classList = clsx("collapsible", className, round && "round", expand && "expand");

	return (
		<div className={classList}>
			<div className="collapsibleHeader" onClick={() => setExpand(!expand)}>
				<p className="label">{label}</p>
				{alert && <span className="alertLabel">{alert}</span>}
				<Icon className="arrow" code="f063" type="solid" />
			</div>
			<div className="collapsibleContent">{expand && children}</div>
		</div>
	);
};

export default Collapsible;

interface TCollapsibleProps {
	alert?: number;
	children: ReactNode;
	className?: string;
	expand: boolean;
	label: string;
	round?: boolean;
	setExpand: (expand: boolean) => void;
}
