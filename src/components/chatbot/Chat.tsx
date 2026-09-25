"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { Icon, Textfield } from "xtreme-ui";
import { useChat } from "../../utils/hooks/useChat";
import { useResize } from "../../utils/hooks/useResize";
import { useOrder, useRestaurant } from "../context/useContext";
import { ChatFab } from "./ChatFab";
import { Welcome } from "./Welcome";

import "./chat.scss";
import { MessageList } from "./MessageList";

export const ChatInterface = () => {
	const session = useSession();
	const { restaurant, loading } = useRestaurant();
	const { setLoginOpen } = useOrder();
	const isAuthenticated = session.status === "authenticated";

	const { isOpen, setIsOpen, messages, isLoading, sendMessage, toggleOpen, resetChat, messagesEndRef, chatRef } = useChat({
		restaurantId: restaurant?.username ?? "",
		isAuthenticated,
	});

	const { dimensions, handleResizeStart } = useResize({
		initialWidth: 500,
		initialHeight: 700,
		minWidth: 350,
		minHeight: 450,
		maxWidth: 640,
		maxHeight: 950,
	});

	const [input, setInput] = useState("");

	const handleLoginRedirect = () => {
		setIsOpen(false);
		setLoginOpen(true);
	};

	return (
		<>
			{!loading && <ChatFab isAuthenticated={isAuthenticated} isOpen={isOpen} resetChat={resetChat} toggleOpen={toggleOpen} />}
			<div
				className={`chatWidget ${isOpen ? "open" : ""}`}
				ref={chatRef}
				style={{
					width: isAuthenticated ? `${dimensions.width}px` : "fit-content",
					height: isAuthenticated ? `${dimensions.height}px` : "fit-content",
				}}
			>
				{isAuthenticated ? (
					<>
						<div className="chatHeader">
							<div className="chatHeaderContent">
								<div className="chatAvatar">
									<Icon code="f544" set="duotone" style={{ "--iconSize": "28px" }} type="solid" />
								</div>
							</div>
						</div>
						<MessageList bottomRef={messagesEndRef} isLoading={isLoading} messages={messages} onResizeStart={handleResizeStart} />
						<Textfield
							className="chatInput"
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
							onKeyDown={(e: React.KeyboardEvent) => {
								if (e.key === "Enter" && input.trim() && !isLoading) {
									sendMessage(input);
									setInput("");
								}
							}}
							placeholder="Ask me anything"
							value={input}
						/>
					</>
				) : (
					<Welcome onLogin={handleLoginRedirect} />
				)}
			</div>
		</>
	);
};
