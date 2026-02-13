import type { MetadataRoute } from "next";
import connectDB from "#utils/database/connect";
import { Profiles } from "#utils/database/models/profile";
import { SITE_URL } from "#utils/seo/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	await connectDB();
	const restaurants = await Profiles.find({}, { restaurantID: 1, updatedAt: 1 }).lean();

	const restaurantEntries: MetadataRoute.Sitemap = restaurants.map((r) => ({
		url: `${SITE_URL}/${r.restaurantID}`,
		lastModified: r.updatedAt ?? new Date(),
		changeFrequency: "daily",
		priority: 0.8,
	}));

	return [
		{
			url: SITE_URL,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 1,
		},
		...restaurantEntries,
	];
}
