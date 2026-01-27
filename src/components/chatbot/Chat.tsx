"use client";

import { useSession } from "next-auth/react";
import { type FormEvent, useState } from "react";
import { Button, Icon, Textfield } from "xtreme-ui";
import type { ChatProps } from "../../types/chat";
import { useChat } from "../../utils/hooks/useChat";
import { useResize } from "../../utils/hooks/useResize";
import { useOrder } from "../context/useContext";
import { Welcome } from "./Welcome";

import "./chat.scss";
import { MessageList } from "./MessageList";

export const ChatInterface = ({ restaurantId }: ChatProps) => {
	const session = useSession();
	const { setLoginOpen } = useOrder();
	const isAuthenticated = session.status === "authenticated";

	const { isOpen, setIsOpen, messages, isLoading, sendMessage, toggleOpen, messagesEndRef } = useChat({
		restaurantId,
		isAuthenticated,
	});

	const { dimensions, handleResizeStart } = useResize({
		initialWidth: 400,
		initialHeight: 600,
		minWidth: 320,
		minHeight: 400,
		maxWidth: 800,
		maxHeight: 900,
	});

	const [input, setInput] = useState("");

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		if (!input.trim() || isLoading) return;

		const messageContent = input;
		setInput("");
		await sendMessage(messageContent);
	};

	const handleLoginRedirect = () => {
		setIsOpen(false);
		setLoginOpen(true);
	};

	return (
		<>
			<button type="button" onClick={toggleOpen} className={`chat-fab ${isOpen ? "open" : ""}`} aria-label={isOpen ? "Close Jarvis" : "Open Jarvis"}>
				<Icon code={isOpen ? "f00d" : "f7d4"} type="solid" size={20} />
			</button>

			<div
				className={`chat-widget ${isOpen ? "open" : ""}`}
				style={{
					width: isAuthenticated ? `${dimensions.width}px` : "360px",
					height: isAuthenticated ? `${dimensions.height}px` : "400px",
				}}>
				{isAuthenticated ? (
					<>
						<button type="button" className="chat-resize-handle" onMouseDown={handleResizeStart} aria-label="Resize chat window">
							<div className="resize-indicator" />
						</button>
						<div className="chat-header">
							<div className="chat-header-content">
								<div className="chat-avatar">
									<Icon code="f544" type="solid" size={24} />
								</div>
								<h3>Jarvis</h3>
							</div>
						</div>

						<MessageList messages={messages} isLoading={isLoading} bottomRef={messagesEndRef} />

						<form onSubmit={handleSubmit} className="chat-input-form">
							<Textfield
								value={input}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
								placeholder="Ask me anything"
								className="chat-input"
							/>
							<Button type="submit" disabled={isLoading || !input.trim()} className="chat-send" filled>
								<Icon code="f1d8" type="solid" size={18} />
							</Button>
						</form>
					</>
				) : (
					<Welcome onLogin={handleLoginRedirect} />
				)}
			</div>
		</>
	);
};
