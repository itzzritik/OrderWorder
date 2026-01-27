import { model, models, Schema } from "mongoose";

export interface IAIConfig {
	exhaustedProviders: string[];
}

const aiConfigSchema = new Schema<IAIConfig>(
	{
		exhaustedProviders: {
			type: [String],
			default: [],
		},
	},
	{ timestamps: true },
);

const AIConfig = models.AIConfig || model<IAIConfig>("AIConfig", aiConfigSchema);

export default AIConfig;
