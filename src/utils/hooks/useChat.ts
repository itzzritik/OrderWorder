import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatMessage } from "../../types/chat";
import { createMessage, sendChatMessage } from "../ai/chat";

interface UseChatProps {
	restaurantId: string;
	isAuthenticated: boolean;
	initialMessages?: ChatMessage[];
}

export const useChat = ({ restaurantId, isAuthenticated, initialMessages = [] }: UseChatProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
	const [isLoading, setIsLoading] = useState(false);
	const chatRef = useRef<HTMLDivElement>(null);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const scrollToBottom = useCallback(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: Scroll on message change
	useEffect(() => {
		scrollToBottom();
	}, [messages, scrollToBottom]);

	const sendMessage = async (messageContent: string) => {
		if (!messageContent.trim()) return;

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

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
				const target = event.target as HTMLElement;
				if (target.closest(".chatFab")) return;
				setIsOpen(false);
			}
		};

		if (isOpen) document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [isOpen]);

	const toggleOpen = () => {
		if (!isOpen && messages.length === 0 && isAuthenticated) sendMessage("Hey!").catch(console.error);
		setIsOpen((prev) => !prev);
	};

	return {
		isOpen,
		setIsOpen,
		messages,
		isLoading,
		sendMessage,
		toggleOpen,
		messagesEndRef,
		chatRef,
	};
};
