import { generateText } from "ai";
import { getServerSession } from "next-auth";
import { getModel } from "#utils/ai/config";
import { getSystemPrompt } from "#utils/ai/prompt";
import { getRestaurantData } from "#utils/database/helper/account";
import type { TMenu } from "#utils/database/models/menu";
import { authOptions } from "#utils/helper/authHelper";

export async function POST(req: Request) {
	try {
		const { messages, restaurantId } = await req.json();
		if (!restaurantId) return Response.json({ text: "Restaurant ID is required", toolResults: [] }, { status: 400 });

		const session = await getServerSession(authOptions);
		if (!session) return Response.json({ text: "Please login to chat with Jarvis", toolResults: [] }, { status: 401 });

		const name = restaurantId.replace(/\b\w/g, (c: string) => c.toUpperCase()).replace(/[-_]/g, " ");
		const account = await getRestaurantData(restaurantId).catch(() => null);

		if (!account) return Response.json({ text: `Restaurant '${name}' not found`, toolResults: [] }, { status: 404 });

		const items: TMenu[] = account?.menus || [];
		const menuMap = new Map(items.map((i) => [i.name.toLowerCase(), i]));

		const result = await generateText({
			model: getModel("groq"),
			system: getSystemPrompt(name, items, session?.customer?.fname),
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
