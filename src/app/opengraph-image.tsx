import { ImageResponse } from "next/og";
import { OgBackground } from "#components/seo/OgBackground";
import { OG_IMAGE_SIZE, SITE_NAME, SITE_TAGLINE } from "#utils/seo/constants";

export const alt = `${SITE_NAME} — ${SITE_TAGLINE}`;
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

export default function OgImage() {
	return new ImageResponse(
		<OgBackground themeColor={{ h: 26, s: 90, l: 55 }}>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					gap: "32px",
				}}>
				{/* Badge */}
				<div
					style={{
						padding: "10px 24px",
						background: "linear-gradient(135deg, #e46b36 0%, #f09819 100%)",
						borderRadius: "99px",
						display: "flex",
						alignItems: "center",
						boxShadow: "0 8px 16px -4px rgba(228, 107, 54, 0.3)",
					}}>
					<span style={{ fontSize: "16px", fontWeight: 700, color: "white", letterSpacing: "1.5px", textTransform: "uppercase" }}>AI-Powered Dining</span>
				</div>

				{/* Title */}
				<div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
					<h1
						style={{
							fontSize: "96px",
							fontWeight: 900,
							color: "#1a1a1a",
							margin: 0,
							lineHeight: 1,
							letterSpacing: "-4px",
							display: "flex",
						}}>
						Order<span style={{ color: "#e46b36" }}>Worder</span>
					</h1>
				</div>

				{/* Tagline */}
				<p
					style={{
						fontSize: "32px",
						color: "#525252",
						margin: 0,
						maxWidth: "700px",
						textAlign: "center",
						fontWeight: 500,
						lineHeight: 1.4,
						letterSpacing: "-0.5px",
					}}>
					{SITE_TAGLINE}
				</p>

				{/* Feature Pills */}
				<div style={{ display: "flex", gap: "16px", marginTop: "16px" }}>
					{["Contactless", "No App Required", "Instant"].map((item) => (
						<div
							key={item}
							style={{
								padding: "8px 20px",
								borderRadius: "12px",
								background: "rgba(0, 0, 0, 0.04)",
								color: "#4a4a4a",
								fontSize: "18px",
								fontWeight: 600,
							}}>
							{item}
						</div>
					))}
				</div>
			</div>
		</OgBackground>,
		{ ...size },
	);
}
