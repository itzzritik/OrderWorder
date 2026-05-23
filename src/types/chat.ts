export interface MenuSuggestion {
	_id: string;
	category: string;
	description: string;
	image: string;
	name: string;
	price: number;
	veg: "veg" | "non-veg" | "contains-egg";
}

export interface ChatMessage {
	content: string;
	createdAt: number;
	id: string;
	role: "user" | "assistant";
	toolResults?: MenuSuggestion[][];
}
