import { generateText } from "ai";
import AIConfig from "#utils/database/models/aiConfig";
import { models } from "./config";

const PROVIDER_ORDER: (keyof typeof models)[] = ["groq", "cerebras", "google"];

export async function getProviderState() {
	let config = await AIConfig.findOne();
	if (!config) {
		config = await AIConfig.create({ exhaustedProviders: [] });
	}
	return config;
}

export async function getAvailableProvider() {
	const config = await getProviderState();
	const exhausted = new Set(config.exhaustedProviders);
	return PROVIDER_ORDER.find((p) => !exhausted.has(p)) || null;
}

export async function markProviderExhausted(provider: string) {
	await AIConfig.updateOne({}, { $addToSet: { exhaustedProviders: provider } }, { upsert: true });
}

export async function resetProviders() {
	await AIConfig.updateOne({}, { $set: { exhaustedProviders: [] } }, { upsert: true });
}

export async function smartGenerateText(params: Omit<Parameters<typeof generateText>[0], "model">) {
	let currentProvider = await getAvailableProvider();

	if (!currentProvider) {
		await resetProviders();
		currentProvider = PROVIDER_ORDER[0];
	}

	while (currentProvider) {
		try {
			console.log(`[AI] Trying provider: ${currentProvider}`);
			const result = await generateText({
				...params,
				model: models[currentProvider],
			} as Parameters<typeof generateText>[0]);
			return result;
		} catch (error) {
			console.error(`[AI] Provider ${currentProvider} failed:`, (error as Error).message);
			await markProviderExhausted(currentProvider);
			currentProvider = await getAvailableProvider();
		}
	}
	throw new Error("All AI providers exhausted");
}
