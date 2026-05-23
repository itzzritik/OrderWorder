import { Button, Icon } from "xtreme-ui";

import "./welcome.scss";

type WelcomeProps = {
	onLogin: () => void;
};

export const Welcome = ({ onLogin }: WelcomeProps) => (
	<div className="chatWelcome">
		<div className="welcomeIcon">
			<Icon code="f4fb" set="duotone" size={68} type="solid" />
		</div>
		<h4>Hey, I'm Jarvis!</h4>
		<p>You need to be logged in to chat with me</p>
		<Button label="Login" onClick={onLogin} />
	</div>
);
