import { createCerebras } from "@ai-sdk/cerebras";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createGroq } from "@ai-sdk/groq";

export const models = {
	groq: createGroq({ apiKey: process.env.GROQ_KEY })("meta-llama/llama-4-scout-17b-16e-instruct"),
	cerebras: createCerebras({ apiKey: process.env.CEREBRAS_KEY })("llama-3.3-70b"),
	google: createGoogleGenerativeAI({ apiKey: process.env.GEMINI_KEY })("gemma-3-27b-it"),
};

export const getModel = (provider: keyof typeof models) => models[provider];
