export interface MenuSuggestion {
	_id: string;
	name: string;
	price: number;
	image: string;
	veg: "veg" | "non-veg" | "contains-egg";
	description: string;
	category: string;
}

export interface ChatMessage {
	id: string;
	role: "user" | "assistant";
	content: string;
	toolResults?: MenuSuggestion[][];
	createdAt: number;
}
