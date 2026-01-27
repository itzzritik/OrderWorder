import { createCerebras } from "@ai-sdk/cerebras";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createGroq } from "@ai-sdk/groq";

const Providers = {
	groq: createGroq({ apiKey: process.env.GROQ_KEY }),
	google: createGoogleGenerativeAI({ apiKey: process.env.GEMINI_KEY }),
	cerebras: createCerebras({ apiKey: process.env.CEREBRAS_KEY }),
};

const models = {
	gemini: Providers.google("gemma-3-27b-it"),
	cerebras: Providers.cerebras("llama-3.3-70b"),
	groq: Providers.groq("meta-llama/llama-4-scout-17b-16e-instruct"),
};

export const getModel = (provider: keyof typeof models) => models[provider];
