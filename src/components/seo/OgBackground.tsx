/** biome-ignore-all lint/a11y/noSvgWithoutTitle: We need it of OG */
import type { TThemeColor } from "xtreme-ui";
import { OG_IMAGE_SIZE } from "#utils/seo/constants";

type Shape = {
	t: "circle" | "ring" | "sq" | "rect" | "tri" | "hex";
	x: number;
	y: number;
	c: string;
	o: number;
	s?: number;
	w?: number;
	h?: number;
	r?: number;
	b?: number;
};

export function OgBackground({ children, themeColor }: { children?: React.ReactNode; themeColor?: TThemeColor }) {
	const { h, s } = { h: 26, s: 90, ...themeColor };
	const c = {
		l: `hsl(${h},${s}%,88%)`,
		p: `hsl(${h},${s}%,65%)`,
		d: `hsl(${h},${s}%,30%)`,
		bg: `radial-gradient(circle at center, #ffffff 30%, hsl(${h},${s}%,96%) 100%)`,
	};

	const items: Shape[] = [
		{ t: "circle", s: 300, x: -80, y: -80, c: c.l, o: 0.3 },
		{ t: "hex", s: 180, x: 350, y: -40, c: c.l, o: 0.25, r: 20 },
		{ t: "ring", s: 120, x: 50, y: 260, c: c.l, o: 0.3, b: 12 },
		{ t: "tri", s: 170, x: 35, y: 380, c: c.l, o: 0.25, r: 35 },

		{ t: "sq", s: 45, x: 155, y: 95, c: c.p, o: 0.6, r: 15 },
		{ t: "tri", s: 55, x: 395, y: 55, c: c.p, o: 0.5, r: -10 },
		{ t: "hex", s: 40, x: 55, y: 155, c: c.p, o: 0.6, r: 45 },
		{ t: "tri", s: 50, x: 255, y: 15, c: c.p, o: 0.55, r: 25 },
		{ t: "sq", s: 36, x: 105, y: 255, c: c.p, o: 0.6, r: 40 },

		{ t: "circle", s: 24, x: 180, y: 195, c: c.d, o: 0.8 },
		{ t: "tri", s: 28, x: 125, y: 25, c: c.d, o: 0.7, r: 30 },
		{ t: "rect", w: 28, h: 16, x: 295, y: 135, c: c.d, o: 0.8, r: -20 },
		{ t: "sq", s: 22, x: 50, y: 85, c: c.d, o: 0.7, r: 60 },
		{ t: "circle", s: 20, x: 200, y: 305, c: c.d, o: 0.6 },
		{ t: "circle", s: 18, x: 255, y: 75, c: c.d, o: 0.5 },
		{ t: "sq", s: 24, x: 25, y: 295, c: c.d, o: 0.6, r: 15 },
	];

	const renderItems = () =>
		items.map((i, k) => {
			const style: any = { position: "absolute", top: i.y, left: i.x, opacity: i.o, width: i.w || i.s, height: i.h || i.s, display: "flex" };
			if (i.r) style.transform = `rotate(${i.r}deg)`;

			if (i.t === "ring") return <div key={k} style={{ ...style, border: `${i.b}px solid ${i.c}`, borderRadius: "50%" }} />;
			if (i.t === "circle") return <div key={k} style={{ ...style, background: i.c, borderRadius: "50%" }} />;
			if (i.t === "sq" || i.t === "rect") return <div key={k} style={{ ...style, background: i.c, borderRadius: Math.min(12, (i.w || i.s || 0) / 3) }} />;

			return (
				<div key={k} style={style}>
					<svg viewBox="0 0 100 100" style={{ overflow: "visible", width: "100%", height: "100%" }}>
						<path
							d={i.t === "tri" ? "M50 15 L85 85 L15 85 Z" : "M25 10 L75 10 L95 50 L75 90 L25 90 L5 50 Z"}
							fill={i.c}
							stroke={i.c}
							strokeWidth={12}
							strokeLinejoin="round"
						/>
					</svg>
				</div>
			);
		});

	const layerStyle: any = { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "flex" };

	return (
		<div
			style={{
				width: OG_IMAGE_SIZE.width,
				height: OG_IMAGE_SIZE.height,
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				background: c.bg,
				fontFamily: "system-ui, sans-serif",
				position: "relative",
				overflow: "hidden",
			}}>
			<div style={layerStyle}>{renderItems()}</div>
			<div style={{ ...layerStyle, transform: "rotate(180deg)" }}>{renderItems()}</div>
			{children}
		</div>
	);
}
