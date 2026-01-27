"use client";

import { useSession } from "next-auth/react";
import { type FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { Button, Icon, Textfield } from "xtreme-ui";
import type { ChatMessage, ChatProps, MenuSuggestion } from "../../types/chat";
import { useResize } from "../../utils/hooks/useResize";
import { useOrder } from "../context/useContext";
import { MenuCard } from "./MenuCard";
import { Welcome } from "./Welcome";

import "./chat.scss";

const sendChatMessage = async (messages: ChatMessage[], restaurantId: string): Promise<{ text: string; toolResults: MenuSuggestion[][] }> => {
	const response = await fetch("/api/chat", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			restaurantId,
			messages: messages.map((m) => ({
				role: m.role,
				content: m.content,
			})),
		}),
	});

	if (!response.ok) throw new Error("Failed to get response");
	const data = await response.json();

	return data;
};

const createMessage = (role: "user" | "assistant", content: string, toolResults?: MenuSuggestion[][]): ChatMessage => {
	return {
		id: Date.now().toString() + Math.random(),
		role,
		content,
		toolResults,
	};
};

export const ChatInterface = ({ restaurantId }: ChatProps) => {
	const session = useSession();
	const { setLoginOpen } = useOrder();
	const isAuthenticated = session.status === "authenticated";
	const [isOpen, setIsOpen] = useState(false);
	const [input, setInput] = useState("");
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const { dimensions, handleResizeStart } = useResize({
		initialWidth: 400,
		initialHeight: 600,
		minWidth: 320,
		minHeight: 400,
		maxWidth: 800,
		maxHeight: 900,
	});

	const scrollToBottom = useCallback(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: Scroll on message change
	useEffect(() => {
		scrollToBottom();
	}, [messages, scrollToBottom]);

	const sendMessage = async (messageContent: string) => {
		const userMessage = createMessage("user", messageContent);
		setMessages((prev) => [...prev, userMessage]);
		setIsLoading(true);

		try {
			const data = await sendChatMessage([...messages, userMessage], restaurantId);
			const assistantMessage = createMessage("assistant", data.text || "", data.toolResults);
			setMessages((prev) => [...prev, assistantMessage]);
		} catch {
			const errorMessage = createMessage("assistant", "Sorry, I encountered an error. Please try again.");
			setMessages((prev) => [...prev, errorMessage]);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		if (!input.trim() || isLoading) return;

		const messageContent = input;
		setInput("");
		await sendMessage(messageContent);
	};

	const handleFabClick = async () => {
		const wasOpen = isOpen;
		setIsOpen(!isOpen);
		if (!wasOpen && messages.length === 0 && isAuthenticated) await sendMessage("Hey!");
	};

	return (
		<>
			<button
				type="button"
				onClick={handleFabClick}
				className={`chat-fab ${isOpen ? "open" : ""}`}
				aria-label={isOpen ? "Close AI Assistant" : "Open AI Assistant"}>
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

						<div className="chat-messages">
							{messages.map((message) => (
								<div key={message.id} className={`chat-message ${message.role}`}>
									{message.role === "user" ? (
										<div className="user-bubble">{message.content}</div>
									) : (
										<div className="assistant-content">
											{message.content && <div className="assistant-text">{message.content}</div>}

											{message.toolResults && message.toolResults.length > 0 && (
												<div className="menu-suggestions">
													{message.toolResults.map((items, idx) => (
														<div key={idx} className="menu-items">
															{items.map((item) => (
																<MenuCard key={item._id} item={item} />
															))}
														</div>
													))}
												</div>
											)}
										</div>
									)}
								</div>
							))}

							{isLoading && (
								<div className="chat-message assistant">
									<div className="assistant-content">
										<div className="typing-indicator">
											<span />
											<span />
											<span />
										</div>
									</div>
								</div>
							)}
							<div ref={messagesEndRef} />
						</div>

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
					<Welcome
						onLogin={() => {
							setIsOpen(false);
							setLoginOpen(true);
						}}
					/>
				)}
			</div>
		</>
	);
};
