"use client";

import { type FormEvent, useCallback, useEffect, useRef, useState } from "react";
import type { ChatMessage, ChatProps, MenuSuggestion } from "../../types/chat";
import { MenuCard } from "./MenuCard";

import "./chat.scss";

async function sendChatMessage(messages: ChatMessage[], provider: string, restaurantId: string): Promise<{ text: string; toolResults: MenuSuggestion[][] }> {
	const response = await fetch(`/api/chat?provider=${provider}&restaurantId=${restaurantId}`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			messages: messages.map((m) => ({
				role: m.role,
				content: m.content,
			})),
		}),
	});

	if (!response.ok) throw new Error("Failed to get response");
	const data = await response.json();

	console.log("📥 Frontend received:", {
		textLength: data.text?.length || 0,
		toolResultsCount: data.toolResults?.length || 0,
		firstResultLength: data.toolResults?.[0]?.length || 0,
	});

	return data;
}

function createMessage(role: "user" | "assistant", content: string, toolResults?: MenuSuggestion[][]): ChatMessage {
	return {
		id: Date.now().toString() + Math.random(),
		role,
		content,
		toolResults,
	};
}

export function ChatInterface({ restaurantId, provider = "groq" }: ChatProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [input, setInput] = useState("");
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const scrollToBottom = useCallback(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, []);

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
			const data = await sendChatMessage([...messages, userMessage], provider, restaurantId);
			const assistantMessage = createMessage("assistant", data.text || "", data.toolResults);

			console.log("💬 Assistant message:", {
				hasToolResults: !!assistantMessage.toolResults,
				toolResultsCount: assistantMessage.toolResults?.length || 0,
			});

			setMessages((prev) => [...prev, assistantMessage]);
		} catch (error) {
			console.error("Chat error:", error);
			const errorMessage = createMessage("assistant", "Sorry, I encountered an error. Please try again.");
			setMessages((prev) => [...prev, errorMessage]);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<button type="button" onClick={() => setIsOpen(!isOpen)} className="chat-fab" aria-label="Open AI Assistant">
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
					<title>Chat</title>
					<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
				</svg>
			</button>

			{isOpen && (
				<div className="chat-container">
					<div className="chat-header">
						<h3>AI Assistant</h3>
						<button type="button" onClick={() => setIsOpen(false)} aria-label="Close">
							×
						</button>
					</div>

					<div className="chat-messages">
						{messages.length === 0 && (
							<div className="chat-welcome">
								<p>👋 Hello! I'm your restaurant assistant.</p>
								<p>Ask me about our menu, food recommendations, or dietary options!</p>
							</div>
						)}

						{messages.map((message) => (
							<div key={message.id} className={`chat-message ${message.role}`}>
								<div className="message-icon">{message.role === "assistant" ? "🤖" : "👤"}</div>
								<div className="message-content">
									{message.content && <p>{message.content}</p>}

									{message.toolResults && message.toolResults.length > 0 && (
										<div className="menu-cards-container">
											{message.toolResults.map((items, idx) => (
												<div key={idx} className="menu-suggestions">
													{items.map((item) => (
														<MenuCard key={item._id} item={item} restaurantId={restaurantId} />
													))}
												</div>
											))}
										</div>
									)}
								</div>
							</div>
						))}

						{isLoading && (
							<div className="chat-message assistant">
								<div className="message-icon">🤖</div>
								<div className="message-content">
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
						<input
							type="text"
							value={input}
							onChange={(e) => setInput(e.target.value)}
							placeholder="Ask about our menu..."
							disabled={isLoading}
							className="chat-input"
						/>
						<button type="submit" disabled={isLoading || !input.trim()} className="chat-send">
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
								<title>Send</title>
								<path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
							</svg>
						</button>
					</form>
				</div>
			)}
		</>
	);
}
