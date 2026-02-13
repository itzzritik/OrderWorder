import { ImageResponse } from "next/og";
import { capitalize } from "xtreme-ui";

import { OgBackground } from "#components/seo/OgBackground";
import { getRestaurantProfile } from "#utils/database/helper/getRestaurantProfile";
import { OG_IMAGE_SIZE, SITE_NAME } from "#utils/seo/constants";

export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

export default async function OgImage({ params }: { params: Promise<{ restaurant: string }> }) {
	const { restaurant } = await params;
	const profile = await getRestaurantProfile(restaurant);
	const name = profile?.name ?? capitalize(restaurant);
	const description = profile?.description ?? `Order online from ${name}`;
	const avatarUrl = profile?.avatar;
	const themeColor = profile?.themeColor;

	return new ImageResponse(
		<OgBackground themeColor={themeColor}>
			{/* === Center content === */}
			<div style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 1, paddingBottom: "80px" }}>
				{/* Circular logo with grey border */}
				<div
					style={{
						width: "180px",
						height: "180px",
						borderRadius: "50%",
						overflow: "hidden",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						background: avatarUrl ? "#fff" : "linear-gradient(145deg, #222, #444)",
						border: "3px solid rgba(0, 0, 0, 0.13)",
						boxShadow: "0 16px 56px rgba(0, 0, 0, 0.07), 0 4px 12px rgba(0, 0, 0, 0.03)",
					}}>
					{avatarUrl ? (
						// biome-ignore lint/performance/noImgElement: next/og ImageResponse only supports native HTML
						<img src={avatarUrl} alt={name} width={180} height={180} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
					) : (
						<span style={{ fontSize: "72px", fontWeight: 700, color: "#fff", lineHeight: 1 }}>{name.charAt(0).toUpperCase()}</span>
					)}
				</div>

				{/* Restaurant name */}
				<span
					style={{
						fontSize: "60px",
						fontWeight: 700,
						color: "#141414",
						letterSpacing: "-2px",
						lineHeight: 1,
						marginTop: "32px",
						textAlign: "center",
					}}>
					{name}
				</span>

				{/* Description */}
				<span
					style={{
						fontSize: "22px",
						fontWeight: 200,
						color: "rgba(0, 0, 0, 0.7)",
						lineHeight: 1.4,
						marginTop: "16px",
						textAlign: "center",
						maxWidth: "740px",
						display: "-webkit-box",
						WebkitLineClamp: 2,
						WebkitBoxOrient: "vertical",
						overflow: "hidden",
						textOverflow: "ellipsis",
					}}>
					{description}
				</span>
			</div>

			{/* Bottom branding */}
			<div
				style={{
					position: "absolute",
					bottom: "30px",
					left: "50%",
					transform: "translateX(-50%)",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					gap: "2px",
				}}>
				<span style={{ fontSize: "14px", color: "rgba(0, 0, 0, 0.4)", fontWeight: 500, letterSpacing: "1px" }}>Powered By</span>
				<span style={{ fontSize: "24px", color: "rgba(0, 0, 0, 0.8)", fontWeight: 900, letterSpacing: "-1px", lineHeight: 1 }}>{SITE_NAME}</span>
			</div>
		</OgBackground>,
		{ ...size },
	);
}
