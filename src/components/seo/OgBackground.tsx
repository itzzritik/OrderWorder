import type { TThemeColor } from "xtreme-ui";

import { OG_IMAGE_SIZE } from "#utils/seo/constants";

type OgBackgroundProps = {
	children?: React.ReactNode;
	themeColor?: TThemeColor;
};

export function OgBackground({ children, themeColor }: OgBackgroundProps) {
	// Default to OrderWorder Orange if no theme color is provided
	const h = themeColor?.h ?? 26; // slightly more orange-yellow than 18
	const s = themeColor?.s ?? 90;
	const l = themeColor?.l ?? 55;

	const primary = `hsl(${h}, ${s}%, ${l}%)`;
	const primaryLight = `hsl(${h}, ${s}%, ${90}%)`;
	const primaryPale = `hsl(${h}, ${s}%, ${96}%)`;
	const primaryDark = `hsl(${h}, ${s}%, ${45}%)`;

	return (
		<div
			style={{
				width: `${OG_IMAGE_SIZE.width}px`,
				height: `${OG_IMAGE_SIZE.height}px`,
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				background: `linear-gradient(135deg, ${primaryPale} 0%, #ffffff 50%, ${primaryPale} 100%)`,
				fontFamily: "system-ui, sans-serif",
				position: "relative",
				overflow: "hidden",
			}}>
			{/* === Abstract Background Layers === */}

			{/* Layer 1: Large Ambient Glows (Symmetrical) */}
			{/* Top Right */}
			<div
				style={{
					position: "absolute",
					top: "-300px",
					right: "-200px",
					width: "900px",
					height: "900px",
					background: `radial-gradient(circle, ${primary} 0%, transparent 70%)`,
					opacity: 0.15,
					filter: "blur(80px)",
				}}
			/>
			{/* Bottom Left (Mirrored) */}
			<div
				style={{
					position: "absolute",
					bottom: "-300px",
					left: "-200px",
					width: "900px",
					height: "900px",
					background: `radial-gradient(circle, ${primary} 0%, transparent 70%)`,
					opacity: 0.15,
					filter: "blur(80px)",
				}}
			/>

			{/* Layer 2: Solid Shapes & Polygons (Symmetrical) */}

			{/* Top Right: Large Circle */}
			<div
				style={{
					position: "absolute",
					top: "50px",
					right: "50px",
					width: "200px",
					height: "200px",
					borderRadius: "50%",
					background: `linear-gradient(135deg, ${primary} 0%, ${primaryDark} 100%)`,
					opacity: 0.1,
				}}
			/>
			{/* Bottom Left: Large Circle (Mirrored) */}
			<div
				style={{
					position: "absolute",
					bottom: "50px",
					left: "50px",
					width: "200px",
					height: "200px",
					borderRadius: "50%",
					background: `linear-gradient(135deg, ${primary} 0%, ${primaryDark} 100%)`,
					opacity: 0.1,
				}}
			/>

			{/* Top Right: Floating Diamond (Polygon) */}
			<div
				style={{
					position: "absolute",
					top: "180px",
					right: "300px",
					width: "80px",
					height: "80px",
					background: primaryLight,
					transform: "rotate(45deg)",
					borderRadius: "12px",
					opacity: 0.6,
				}}
			/>
			{/* Bottom Left: Floating Diamond (Mirrored) */}
			<div
				style={{
					position: "absolute",
					bottom: "180px",
					left: "300px",
					width: "80px",
					height: "80px",
					background: primaryLight,
					transform: "rotate(45deg)",
					borderRadius: "12px",
					opacity: 0.6,
				}}
			/>

			{/* Top Right: Donut Ring */}
			<div
				style={{
					position: "absolute",
					top: "-50px",
					right: "350px",
					width: "150px",
					height: "150px",
					borderRadius: "50%",
					border: `20px solid ${primary}`,
					opacity: 0.05,
				}}
			/>
			{/* Bottom Left: Donut Ring (Mirrored) */}
			<div
				style={{
					position: "absolute",
					bottom: "-50px",
					left: "350px",
					width: "150px",
					height: "150px",
					borderRadius: "50%",
					border: `20px solid ${primary}`,
					opacity: 0.05,
				}}
			/>

			{/* Layer 3: Smaller Accents & Particles */}

			{/* Top Right Cluster */}
			<div
				style={{
					position: "absolute",
					top: "300px",
					right: "100px",
					width: "40px",
					height: "40px",
					borderRadius: "50%",
					background: primary,
					opacity: 0.3,
				}}
			/>
			<div
				style={{
					position: "absolute",
					top: "340px",
					right: "160px",
					width: "20px",
					height: "20px",
					borderRadius: "4px",
					background: "rgba(0,0,0,0.1)", // Grey accent
					transform: "rotate(15deg)",
				}}
			/>

			{/* Bottom Left Cluster (Mirrored) */}
			<div
				style={{
					position: "absolute",
					bottom: "300px",
					left: "100px",
					width: "40px",
					height: "40px",
					borderRadius: "50%",
					background: primary,
					opacity: 0.3,
				}}
			/>
			<div
				style={{
					position: "absolute",
					bottom: "340px",
					left: "160px",
					width: "20px",
					height: "20px",
					borderRadius: "4px",
					background: "rgba(0,0,0,0.1)", // Grey accent
					transform: "rotate(15deg)",
				}}
			/>

			{/* Subtle Grid Overlay */}
			<div
				style={{
					position: "absolute",
					inset: 0,
					backgroundImage: `radial-gradient(${primary} 1px, transparent 1px)`,
					backgroundSize: "50px 50px",
					opacity: 0.1,
					maskImage: "radial-gradient(circle at center, transparent 40%, black 100%)", // Fade out grid in center
				}}
			/>

			{/* === Content === */}
			{children}
		</div>
	);
}
