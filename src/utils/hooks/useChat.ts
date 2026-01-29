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

	const sendMessage = async (messageContent: string, options?: { hidden?: boolean; overrideHistory?: ChatMessage[] }) => {
		if (!messageContent.trim()) return;

		const userMessage = createMessage("user", messageContent);
		if (!options?.hidden) setMessages((prev) => [...prev, userMessage]);
		setIsLoading(true);

		try {
			const historyToUse = options?.overrideHistory ?? messages;
			const data = await sendChatMessage([...historyToUse, userMessage], restaurantId);
			const assistantMessage = createMessage(
				"assistant",
				(data.text || "").replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "").replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gim, ""),
				data.toolResults,
			);
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
				if (target.closest(".chatFab") || target.closest(".newChatFab")) return;
				setIsOpen(false);
			}
		};

		if (isOpen) {
			document.body.classList.add("chat-open");
			document.addEventListener("mousedown", handleClickOutside);
		} else document.body.classList.remove("chat-open");

		return () => {
			document.body.classList.remove("chat-open");
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen]);

	const toggleOpen = () => {
		if (!isOpen && messages.length === 0 && isAuthenticated) sendMessage("Hey!", { hidden: true }).catch(console.error);
		setIsOpen((prev) => !prev);
	};

	const resetChat = async () => {
		setMessages([]);
		if (isAuthenticated) {
			await sendMessage("Hey!", { hidden: true, overrideHistory: [] });
		}
	};

	return {
		isOpen,
		setIsOpen,
		messages,
		isLoading,
		sendMessage,
		toggleOpen,
		resetChat,
		messagesEndRef,
		chatRef,
	};
};
