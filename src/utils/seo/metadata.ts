import type { Metadata } from "next";
import { SITE_DESCRIPTION, SITE_KEYWORDS, SITE_NAME, SITE_URL } from "./constants";

type OGImage = { url: string; width?: number; height?: number; alt?: string };

type MetadataOverrides = {
	title?: string;
	description?: string;
	path?: string;
	images?: OGImage[];
};

export function buildMetadata({ title, description, path = "", images }: MetadataOverrides = {}): Metadata {
	const url = `${SITE_URL}${path}`;
	const desc = description ?? SITE_DESCRIPTION;

	return {
		title,
		description: desc,
		keywords: [...SITE_KEYWORDS],
		alternates: { canonical: url },
		openGraph: {
			title: title ? `${title} | ${SITE_NAME}` : SITE_NAME,
			description: desc,
			url,
			siteName: SITE_NAME,
			locale: "en_US",
			type: "website",
			...(images ? { images } : {}),
		},
		twitter: {
			card: "summary_large_image",
			title: title ? `${title} | ${SITE_NAME}` : SITE_NAME,
			description: desc,
			...(images ? { images } : {}),
		},
	};
}
