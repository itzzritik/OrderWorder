import { Button, Icon } from "xtreme-ui";

import "./welcome.scss";

type WelcomeProps = {
	onLogin: () => void;
};

export const Welcome = ({ onLogin }: WelcomeProps) => {
	return (
		<div className="chat-welcome">
			<div className="welcome-icon">
				<Icon code="f544" type="solid" size={24} />
			</div>
			<h4>Hey, I'm Jarvis!</h4>
			<p>You need to be logged in to chat with me</p>
			<Button label="Login" onClick={onLogin} />
		</div>
	);
};
