import { Button } from "xtreme-ui";
import "./chatFab.scss";

interface ChatFabProps {
	isOpen: boolean;
	toggleOpen: () => void;
	resetChat: () => void;
	isAuthenticated: boolean;
}

export const ChatFab = ({ isOpen, toggleOpen, resetChat, isAuthenticated }: ChatFabProps) => {
	return (
		<div className={`chatControls ${isOpen && isAuthenticated ? "combined" : ""}`}>
			<Button
				className={`chatFab ${isOpen ? "open" : ""}`}
				type="primary"
				onClick={toggleOpen}
				icon={isOpen ? "f00d" : "f7d4"}
				iconType={isOpen ? "solid" : "duotone"}
			/>
			{isOpen && isAuthenticated && <Button className="newChatFab" type="primary" onClick={resetChat} icon="f067" iconType="solid" label="New" />}
		</div>
	);
};
