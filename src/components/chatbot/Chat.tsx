"use client";

import { type FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { Button, Icon, Textfield } from "xtreme-ui";
import type { ChatMessage, ChatProps, MenuSuggestion } from "../../types/chat";
import { MenuCard } from "./MenuCard";

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
	const [isOpen, setIsOpen] = useState(false);
	const [input, setInput] = useState("");
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const scrollToBottom = useCallback(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), []);

	useEffect(() => {
		scrollToBottom();
	}, [scrollToBottom]);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		if (!input.trim() || isLoading) return;

		const userMessage = createMessage("user", input);
		setMessages((prev) => [...prev, userMessage]);
		setInput("");
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

	return (
		<>
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className={`chat-fab ${isOpen ? "open" : ""}`}
				aria-label={isOpen ? "Close AI Assistant" : "Open AI Assistant"}>
				<Icon code={isOpen ? "f00d" : "f7d4"} type="solid" size={20} />
			</button>

			<div className={`chat-widget ${isOpen ? "open" : ""}`}>
				<div className="chat-header">
					<div className="chat-header-content">
						<div className="chat-avatar">
							<Icon code="f544" type="solid" size={24} />
						</div>
						<h3>Jarvis</h3>
					</div>
				</div>

				<div className="chat-messages">
					{messages.length === 0 && (
						<div className="chat-welcome">
							<div className="welcome-icon">
								<Icon code="f544" type="solid" size={48} />
							</div>
							<h4>Hello! I'm Jarvis</h4>
							<p>Your restaurant assistant</p>
							<p>Ask me about our menu, food recommendations, or dietary options!</p>
						</div>
					)}

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
						placeholder="Ask about our menu..."
						disabled={isLoading}
						className="chat-input"
					/>
					<Button type="submit" disabled={isLoading || !input.trim()} className="chat-send" filled>
						<Icon code="f1d8" type="solid" size={18} />
					</Button>
				</form>
			</div>
		</>
	);
};
