import type { MetadataRoute } from "next";
import { SITE_URL } from "#utils/seo/constants";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: ["/api/", "/dashboard/", "/kitchen/", "/logout/", "/scan/"],
			},
		],
		sitemap: `${SITE_URL}/sitemap.xml`,
	};
}
