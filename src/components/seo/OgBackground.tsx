import type { TThemeColor } from "xtreme-ui";
import { OG_IMAGE_SIZE } from "#utils/seo/constants";

export function OgBackground({ children, themeColor }: { children?: React.ReactNode; themeColor?: TThemeColor }) {
	const { h, s, l } = { h: 26, s: 90, l: 55, ...themeColor };
	const [p, pL, pD, pS, pPale] = [`hsl(${h},${s}%,${l}%)`, `hsl(${h},${s}%,85%)`, `hsl(${h},${s}%,40%)`, `hsl(${h},${s}%,${l}%,0.4)`, `hsl(${h},${s}%,96%)`];
	const bg = `linear-gradient(135deg, #fff 0%, ${pPale} 50%, #fff 100%)`;

	const items = [
		{ t: "glow", y: -150, x: -150, s: 700, c: p, o: 0.06 },
		{ t: "ring", y: 40, x: 160, s: 45, b: 6, c: p, o: 0.7 },
		{ t: "ring", y: 280, x: 40, s: 28, b: 4, c: pD, o: 0.5 },
		{ t: "ring", y: 120, x: 420, s: 18, b: 3, c: pL, o: 0.6 },
		{ t: "sq", y: 130, x: 90, s: 32, r: 15, c: p, o: 0.8 },
		{ t: "sq", y: 50, x: 340, s: 22, r: 45, c: pL, o: 0.9 },
		{ t: "sq", y: 240, x: 260, s: 16, r: 30, c: pD, o: 0.6 },
		{ t: "sq", y: 380, x: 120, s: 14, r: 10, c: pS, o: 0.8 },
		{ t: "rect", y: 170, x: 40, w: 65, h: 14, r: -20, c: pL, o: 0.9 },
		{ t: "rect", y: 330, x: 160, w: 45, h: 9, r: 10, c: p, o: 0.75 },
		{ t: "rect", y: 80, x: 440, w: 35, h: 7, r: 60, c: pS, o: 0.85 },
		{ t: "rect", y: 20, x: 220, w: 20, h: 6, r: -45, c: pD, o: 0.5 },
		{ t: "cir", y: 110, x: 290, s: 14, c: pD, o: 0.7 },
		{ t: "cir", y: 250, x: 30, s: 20, c: pL, o: 0.85 },
		{ t: "cir", y: 20, x: 110, s: 9, c: p, o: 0.5 },
		{ t: "cir", y: 360, x: 320, s: 11, c: p, o: 0.4 },
		{ t: "sq", y: 190, x: 360, s: 8, r: 15, c: p, o: 0.6 },
		{ t: "rect", y: 270, x: 310, w: 28, h: 6, r: -45, c: pD, o: 0.5 },
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
				borderRadius: i.t === "sq" || i.t === "rect" ? 4 : "50%",
			};
			if (i.t === "glow") {
				st.background = `radial-gradient(circle, ${i.c} 0%, transparent 70%)`;
				st.filter = "blur(50px)";
			} else if (i.t === "ring") {
				st.border = `${i.b}px solid ${i.c}`;
			} else {
				st.background = i.c;
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
