import type { TThemeColor } from "xtreme-ui";
import { OG_IMAGE_SIZE } from "#utils/seo/constants";

export function OgBackground({ children, themeColor }: { children?: React.ReactNode; themeColor?: TThemeColor }) {
	const { h, s, l } = { h: 26, s: 90, l: 55, ...themeColor };
	const [p, pL, pD, pS, pPale] = [`hsl(${h},${s}%,${l}%)`, `hsl(${h},${s}%,85%)`, `hsl(${h},${s}%,40%)`, `hsl(${h},${s}%,${l}%,0.4)`, `hsl(${h},${s}%,96%)`];
	const bg = `radial-gradient(circle at center, #ffffff 40%, ${pPale} 100%)`;

	const items = [
		// Large background elements
		{ t: "glow", y: -150, x: -150, s: 700, c: p, o: 0.06 },
		{ t: "ring", y: -50, x: 350, s: 120, b: 12, c: pL, o: 0.2 },

		// Main confetti cluster (Top Left)
		{ t: "hex", y: 40, x: 60, s: 50, r: 15, c: p, o: 0.8 },
		{ t: "tri", y: 120, x: 180, s: 35, r: 45, c: pD, o: 0.7 },
		{ t: "sq", y: 80, x: 280, s: 25, r: 30, c: pL, o: 0.9 },
		{ t: "cir", y: 160, x: 100, s: 18, c: pS, o: 0.6 },
		{ t: "hex", y: 220, x: 40, s: 40, r: 60, c: p, o: 0.5 },

		// Scattered smaller pieces
		{ t: "tri", y: 40, x: 380, s: 20, r: 15, c: pD, o: 0.8 },
		{ t: "rect", y: 150, x: 320, w: 40, h: 10, r: -20, c: p, o: 0.7 },
		{ t: "sq", y: 200, x: 240, s: 15, r: 45, c: pL, o: 0.85 },
		{ t: "cir", y: 280, x: 160, s: 12, c: pD, o: 0.6 },
		{ t: "hex", y: 25, x: 200, s: 22, r: 30, c: pS, o: 0.75 },

		// Edge decorations
		{ t: "ring", y: 260, x: -20, s: 45, b: 4, c: p, o: 0.5 },
		{ t: "poly", y: 320, x: 80, s: 30, r: 10, c: pL, o: 0.6 }, // poly maps to pentagon
		{ t: "rect", y: 10, x: 420, w: 30, h: 8, r: 60, c: pD, o: 0.8 },

		// Tiny fillers
		{ t: "sq", y: 180, x: 400, s: 8, r: 15, c: p, o: 0.6 },
		{ t: "cir", y: 90, x: 140, s: 6, c: pD, o: 0.5 },
		{ t: "tri", y: 240, x: 340, s: 12, r: -30, c: pL, o: 0.7 },
		{ t: "hex", y: 110, x: 450, s: 15, r: 45, c: p, o: 0.4 },
		{ t: "cir", y: 300, x: 280, s: 9, c: pS, o: 0.5 },

		// More variety
		{ t: "rect", y: 340, x: 20, w: 25, h: 6, r: -45, c: pD, o: 0.5 },
		{ t: "tri", y: 60, x: 20, s: 16, r: 120, c: pL, o: 0.8 },
		{ t: "hex", y: 190, x: 130, s: 28, r: 15, c: pS, o: 0.3 },
		{ t: "sq", y: 290, x: 420, s: 14, r: 75, c: p, o: 0.6 },
	];

	const render = () =>
		items.map((i, k) => {
			const st: any = {
				position: "absolute",
				top: i.y,
				left: i.x,
				opacity: i.o,
				width: i.w || i.s,
				height: i.h || i.s,
			};

			if (i.t === "glow") {
				st.background = `radial-gradient(circle, ${i.c} 0%, transparent 70%)`;
				st.filter = "blur(50px)";
				st.borderRadius = "50%";
			} else if (i.t === "ring") {
				st.border = `${i.b}px solid ${i.c}`;
				st.borderRadius = "50%";
			} else if (i.t === "tri") {
				st.background = i.c;
				st.clipPath = "polygon(50% 0%, 0% 100%, 100% 100%)";
			} else if (i.t === "hex") {
				st.background = i.c;
				st.clipPath = "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)";
			} else if (i.t === "poly") {
				st.background = i.c;
				st.clipPath = "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)"; // Pentagon
			} else {
				st.background = i.c;
				st.borderRadius = i.t === "sq" || i.t === "rect" ? 4 : "50%";
			}

			if (i.r) st.transform = `rotate(${i.r}deg)`;
			return <div key={k} style={st} />;
		});

	return (
		<div
			style={{
				width: `${OG_IMAGE_SIZE.width}px`,
				height: `${OG_IMAGE_SIZE.height}px`,
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				background: bg,
				fontFamily: "system-ui, sans-serif",
				position: "relative",
				overflow: "hidden",
			}}>
			<div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "flex" }}>{render()}</div>
			<div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "flex", transform: "rotate(180deg)" }}>{render()}</div>
			{children}
		</div>
	);
}
