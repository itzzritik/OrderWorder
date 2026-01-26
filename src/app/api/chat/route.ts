import { generateText } from "ai";
import { getModel } from "#utils/ai/config";
import { getSystemPrompt } from "#utils/ai/prompt";
import { getRestaurantData } from "#utils/database/helper/account";
import type { TMenu } from "#utils/database/models/menu";

export async function POST(req: Request) {
	try {
		const { messages } = await req.json();
		const url = new URL(req.url);

		const id = url.searchParams.get("restaurantId") || "starbucks";
		const provider = url.searchParams.get("provider") || "groq";
		const name = id.replace(/\b\w/g, (c) => c.toUpperCase()).replace(/[-_]/g, " ");

		const account = await getRestaurantData(id).catch(() => null);
		const items: TMenu[] = account?.menus || [];

		const menuMap = new Map(items.map((i) => [i.name.toLowerCase(), i]));

		const result = await generateText({
			model: getModel(provider),
			system: getSystemPrompt(name, items),
			messages,
		});

		let text = result.text;
		const toolResults: TMenu[][] = [];
		const match = text.match(/<<<REC:?(.*?)>>>/);

		if (match) {
			text = text.replace(match[0], "").trim();
			try {
				const names = JSON.parse(match[1]);
				if (Array.isArray(names)) {
					const found = names.map((n: string) => menuMap.get(n.toLowerCase())).filter((i): i is TMenu => !!i);
					if (found.length) toolResults.push(found);
				}
			} catch {}
		}

		return Response.json({ text, toolResults });
	} catch {
		return Response.json({ text: "I apologize, but I'm having trouble connecting right now. Please try again.", toolResults: [] }, { status: 500 });
	}
}
