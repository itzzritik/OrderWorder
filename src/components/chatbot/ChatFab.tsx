import { Button } from "xtreme-ui";
import "./chatFab.scss";

interface ChatFabProps {
	isAuthenticated: boolean;
	isOpen: boolean;
	resetChat: () => void;
	toggleOpen: () => void;
}

export const ChatFab = ({ isOpen, toggleOpen, resetChat, isAuthenticated }: ChatFabProps) => (
	<div className={`chatControls ${isOpen && isAuthenticated ? "combined" : ""}`}>
		<Button
			className={`chatFab ${isOpen ? "open" : ""}`}
			icon={isOpen ? "f00d" : "f7d4"}
			iconType={isOpen ? "solid" : "duotone"}
			onClick={toggleOpen}
			type="primary"
		/>
		{isOpen && isAuthenticated && <Button className="newChatFab" icon="f067" iconType="solid" label="New" onClick={resetChat} type="primary" />}
	</div>
);
