import clsx from "clsx";
import type { ReactNode } from "react";
import { Button } from "xtreme-ui";

import "./modal.scss";

const Modal = (props: TModal) => {
	const { children, open, setOpen, closeIcon = "e59b" } = props;
	const classList = clsx("modal", open && "open");

	return (
		<div className={classList}>
			<div className="backdrop" onClick={() => setOpen(false)} />
			<div className="modalPane">
				{children}
				{closeIcon && <Button className="closeModal" icon={closeIcon} onClick={() => setOpen(false)} size="mini" />}
			</div>
		</div>
	);
};

export default Modal;

interface TModal {
	children: ReactNode;
	closeIcon?: string;
	open: boolean;
	setOpen: (open: boolean) => void;
}
