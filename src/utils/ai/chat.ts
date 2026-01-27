import type { ChatMessage, MenuSuggestion } from "../../types/chat";

export const sendChatMessage = async (messages: ChatMessage[], restaurantId: string): Promise<{ text: string; toolResults: MenuSuggestion[][] }> => {
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

export const createMessage = (role: "user" | "assistant", content: string, toolResults?: MenuSuggestion[][]): ChatMessage => {
	return {
		id: Date.now().toString() + Math.random(),
		role,
		content,
		toolResults,
	};
};
