import { createCerebras } from "@ai-sdk/cerebras";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createGroq } from "@ai-sdk/groq";
import { generateText } from "ai";

interface MenuItem {
	_id: string;
	name: string;
	description: string;
	category: string;
	price: number;
	image: string;
	veg: "veg" | "non-veg" | "contains-egg";
	[key: string]: unknown;
}

function capitalizeWords(str: string): string {
	return str
		.split(/[-_\s]/)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(" ");
}

function getAIProvider(provider: string) {
	const groq = createGroq({ apiKey: process.env.GROQ_KEY });
	const google = createGoogleGenerativeAI({ apiKey: process.env.GEMINI_KEY });
	const cerebras = createCerebras({ apiKey: process.env.CEREBRAS_KEY });

	const models = {
		groq: groq("meta-llama/llama-4-scout-17b-16e-instruct"),
		gemini: google("gemini-2.0-flash-exp"),
		cerebras: cerebras("llama3.1-8b"),
	};

	return models[provider as keyof typeof models] || models.groq;
}

async function fetchMenuItems(restaurantId: string): Promise<MenuItem[]> {
	try {
		const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3050";
		const url = `${baseUrl}/api/menu?id=${restaurantId}`;

		const response = await fetch(url, { cache: "no-store" });
		if (!response.ok) return [];

		const data = await response.json();
		return data.menus || [];
	} catch {
		return [];
	}
}

function getSystemPrompt(restaurantName: string, menuItems: MenuItem[]) {
	const menuContext = menuItems.map((item) => `- ${item.name} (${item.category}): ${item.description || "No description"} - ₹${item.price} [${item.veg}]`).join("\n");

	return `You are Jarvis from ${restaurantName}.

MENU:
${menuContext}

RULES:
1. IF GREETING (e.g. "Hi", "Hello"): Introduce yourself and welcome them to ${restaurantName}. STOP. DO NOT mention specific food items. DO NOT return JSON.
2. SCOPE: Discuss ONLY ${restaurantName} food. DO NOT answer off-topic questions (math, weather, GK, etc). politely decline first, THEN pivot to menu. NO Appreciation or disclaimers.
3. TONE: Always humble and polite. Occasionally be witty or playful/savage to keep it engaging.
4. IF FOOD QUERY: Suggest 4-6 items. Text must be short (1-2 sentences), appetizing, and punchy. No prices/ingredients. End with JSON: <<<REC:["Item1", "Item2"]>>>`;
}

export async function POST(req: Request) {
	try {
		const { messages } = await req.json();
		const url = new URL(req.url);
		const provider = url.searchParams.get("provider") || "groq";
		const restaurantId = url.searchParams.get("restaurantId") || "starbucks";

		const restaurantName = capitalizeWords(restaurantId);
		const menuItems = await fetchMenuItems(restaurantId);
		const model = getAIProvider(provider);

		const result = await generateText({
			model,
			system: getSystemPrompt(restaurantName, menuItems),
			messages,
		});

		let textResponse = result.text;
		const toolResults: MenuItem[][] = [];

		const jsonMatch = textResponse.match(/<<<REC:?(.*?)>>>/);
		if (jsonMatch) {
			textResponse = textResponse.replace(jsonMatch[0], "").trim();

			if (jsonMatch[1]) {
				try {
					const recommendedNames = JSON.parse(jsonMatch[1]);
					if (Array.isArray(recommendedNames)) {
						const matchedItems = recommendedNames
							.map((name: string) => menuItems.find((item) => item.name.toLowerCase() === name.toLowerCase()))
							.filter((item): item is MenuItem => item !== undefined);

						if (matchedItems.length > 0) {
							toolResults.push(matchedItems);
						}
					}
				} catch {
					// Fail silently on parse error
				}
			}
		}

		return Response.json({
			text: textResponse,
			toolResults,
		});
	} catch (_error) {
		return Response.json(
			{
				text: "I apologize, but I'm having trouble connecting right now. Please try again.",
				toolResults: [],
			},
			{ status: 500 },
		);
	}
}
