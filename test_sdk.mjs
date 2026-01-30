import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { generateText } from "ai";

console.log("Testing SiliconFlow with @ai-sdk/openai-compatible...");

const siliconflow = createOpenAICompatible({
	baseURL: "https://api.siliconflow.com/v1",
	apiKey: process.env.SILICONFLOW_KEY,
	fetch: async (url, options) => {
		console.log("DEBUG FETCH URL:", url);
		console.log("DEBUG FETCH HEADERS:", options.headers);
		const res = await fetch(url, options);
		console.log("DEBUG FETCH STATUS:", res.status);
		return res;
	},
	compatibility: "compatible",
});

const model = siliconflow("DeepSeek-V3");

(async () => {
	try {
		console.log("Sending request...");
		const result = await generateText({
			model: model,
			prompt: "Hello",
			maxTokens: 10,
		});
		console.log("✅ Success:", result.text);
	} catch (e) {
		console.log("❌ Failed:", e.message);
		console.log("Cause:", e.cause); // often contains the raw response/url details
		if (e.responseObject) {
			// In some versions of AI SDK
			console.log("Response headers:", e.responseObject.headers);
		}
	}
})();
