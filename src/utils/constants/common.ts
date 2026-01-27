import { ThemeColorsPreset } from "xtreme-ui";

// export const ANIM_CDN = 'https://raw.githubusercontent.com/itzzjarvis/Assets/main/anim/lottie';
export const getAnimSrc = (fileName: string) => `https://raw.githubusercontent.com/itzzjarvis/Assets/main/anim/lottie/${fileName}.lottie`;

export const DEFAULT_THEME_COLOR = ThemeColorsPreset.plum;

export const VEG_ICON_CODE = {
	veg: "f4d8",
	"non-veg": "f6d6",
	"contains-egg": "f7fb",
} as const;
