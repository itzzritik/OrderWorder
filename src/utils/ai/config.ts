import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

const configs = [
	{
		platform: "siliconflow",
		url: "https://api.siliconflow.com/v1",
		model: "deepseek-ai/DeepSeek-V3.1",
	},
	{
		platform: "google",
		url: "https://generativelanguage.googleapis.com/v1beta/openai",
		model: "gemini-2.5-flash-lite",
	},
	{
		platform: "cerebras",
		url: "https://api.cerebras.ai/v1",
		model: "llama-3.3-70b",
	},
	{
		platform: "groq",
		url: "https://api.groq.com/openai/v1",
		model: "meta-llama/llama-4-scout-17b-16e-instruct",
	},
] as const;

type AIProvider = ReturnType<ReturnType<typeof createOpenAICompatible>>;

export const models = Object.fromEntries(
	configs.map(({ platform, url, model }) => {
		const provider = createOpenAICompatible({
			baseURL: url,
			apiKey: process.env[`AI_${platform.toUpperCase()}_KEY`],
			name: platform,
		});
		return [platform, provider(model)];
	}),
) as Record<(typeof configs)[number]["platform"], AIProvider>;

export const getModel = (provider: keyof typeof models) => models[provider];
