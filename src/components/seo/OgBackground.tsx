import type { TThemeColor } from "xtreme-ui";
import { OG_IMAGE_SIZE } from "#utils/seo/constants";

type OgBackgroundProps = {
	children?: React.ReactNode;
	themeColor?: TThemeColor;
};

export function OgBackground({ children, themeColor }: OgBackgroundProps) {
	// Default to OrderWorder Orange if no theme color is provided
	const h = themeColor?.h ?? 26;
	const s = themeColor?.s ?? 90;
	const l = themeColor?.l ?? 55;

	// Palette generation
	const primary = `hsl(${h}, ${s}%, ${l}%)`;
	const primaryLight = `hsl(${h}, ${s}%, ${85}%)`;
	const primaryDark = `hsl(${h}, ${s}%, ${40}%)`;
	const primarySoft = `hsl(${h}, ${s}%, ${l}%, 0.4)`;
	const primaryPale = `hsl(${h}, ${s}%, ${96}%)`;

	// Professional subtle background
	const background = `linear-gradient(135deg, #ffffff 0%, ${primaryPale} 50%, #ffffff 100%)`;

	// Confetti Shapes Data
	// Defined for Top-Left corner. Will be mirrored for Bottom-Right.
	// Coordinates are roughly within 0-450px from the corner to keep center clear.
	const confettiItems = [
		// 1. Large Ambient Glow (Background)
		{ type: "glow", top: -150, left: -150, size: 700, color: primary, opacity: 0.06 },

		// 2. Rings (Donuts)
		{ type: "ring", top: 40, left: 160, size: 45, border: 6, color: primary, opacity: 0.7 },
		{ type: "ring", top: 280, left: 40, size: 28, border: 4, color: primaryDark, opacity: 0.5 },
		{ type: "ring", top: 120, left: 420, size: 18, border: 3, color: primaryLight, opacity: 0.6 },

		// 3. Polygons / Squares (Diamonds)
		{ type: "square", top: 130, left: 90, size: 32, rotation: 15, color: primary, opacity: 0.8 },
		{ type: "square", top: 50, left: 340, size: 22, rotation: 45, color: primaryLight, opacity: 0.9 },
		{ type: "square", top: 240, left: 260, size: 16, rotation: 30, color: primaryDark, opacity: 0.6 },
		{ type: "square", top: 380, left: 120, size: 14, rotation: 10, color: primarySoft, opacity: 0.8 },

		// 4. Ribbons / Rectangles
		{ type: "rect", top: 170, left: 40, width: 65, height: 14, rotation: -20, color: primaryLight, opacity: 0.9 },
		{ type: "rect", top: 330, left: 160, width: 45, height: 9, rotation: 10, color: primary, opacity: 0.75 },
		{ type: "rect", top: 80, left: 440, width: 35, height: 7, rotation: 60, color: primarySoft, opacity: 0.85 },
		{ type: "rect", top: 20, left: 220, width: 20, height: 6, rotation: -45, color: primaryDark, opacity: 0.5 },

		// 5. Circles (Dots)
		{ type: "circle", top: 110, left: 290, size: 14, color: primaryDark, opacity: 0.7 },
		{ type: "circle", top: 250, left: 30, size: 20, color: primaryLight, opacity: 0.85 },
		{ type: "circle", top: 20, left: 110, size: 9, color: primary, opacity: 0.5 },
		{ type: "circle", top: 360, left: 320, size: 11, color: primary, opacity: 0.4 },

		// 6. Tiny particles for texture
		{ type: "square", top: 190, left: 360, size: 8, rotation: 15, color: primary, opacity: 0.6 },
		{ type: "rect", top: 270, left: 310, width: 28, height: 6, rotation: -45, color: primaryDark, opacity: 0.5 },
	];

	// Helper to render confetti items
	const renderConfetti = () => (
		<>
			{confettiItems.map((item, i) => {
				const commonStyle = {
					position: "absolute" as const,
					top: item.top,
					left: item.left,
					opacity: item.opacity,
				};

				if (item.type === "glow") {
					return (
						<div
							key={`glow-${i}`}
							style={{
								...commonStyle,
								width: item.size,
								height: item.size,
								borderRadius: "50%",
								background: `radial-gradient(circle, ${item.color} 0%, transparent 70%)`,
								filter: "blur(50px)",
							}}
						/>
					);
				}
				if (item.type === "ring") {
					return (
						<div
							key={`ring-${i}`}
							style={{
								...commonStyle,
								width: item.size,
								height: item.size,
								borderRadius: "50%",
								border: `${item.border}px solid ${item.color}`,
							}}
						/>
					);
				}
				if (item.type === "square") {
					return (
						<div
							key={`square-${i}`}
							style={{
								...commonStyle,
								width: item.size,
								height: item.size,
								background: item.color,
								borderRadius: 4,
								transform: `rotate(${item.rotation || 0}deg)`,
							}}
						/>
					);
				}
				if (item.type === "rect") {
					return (
						<div
							key={`rect-${i}`}
							style={{
								...commonStyle,
								width: item.width,
								height: item.height,
								background: item.color,
								borderRadius: 4,
								transform: `rotate(${item.rotation || 0}deg)`,
							}}
						/>
					);
				}
				if (item.type === "circle") {
					return (
						<div
							key={`circle-${i}`}
							style={{
								...commonStyle,
								width: item.size,
								height: item.size,
								borderRadius: "50%",
								background: item.color,
							}}
						/>
					);
				}
				return null;
			})}
		</>
	);

	return (
		<div
			style={{
				width: `${OG_IMAGE_SIZE.width}px`,
				height: `${OG_IMAGE_SIZE.height}px`,
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				background: background,
				fontFamily: "system-ui, sans-serif",
				position: "relative",
				overflow: "hidden",
			}}>
			{/* === Confetti Layers === */}

			{/* Top Left Group */}
			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					width: "100%",
					height: "100%",
					display: "flex", // Helper to contain children
				}}>
				{renderConfetti()}
			</div>

			{/* Bottom Right Group (Mirrored by rotating 180deg around center) */}
			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					width: "100%",
					height: "100%",
					display: "flex",
					transform: "rotate(180deg)",
				}}>
				{renderConfetti()}
			</div>

			{/* === Center Content === */}
			{children}
		</div>
	);
}
