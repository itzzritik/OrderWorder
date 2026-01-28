import { themeController } from "xtreme-ui";
import { DEFAULT_THEME_COLOR } from "#utils/constants/common";
import { getThemeColor } from "#utils/database/helper/getThemeColor";
import ScannerClient from "./ScannerClient";

export default async function ScanPage() {
	const color = (await getThemeColor()) ?? DEFAULT_THEME_COLOR;

	return (
		<>
			<script dangerouslySetInnerHTML={{ __html: themeController({ color }) }} suppressHydrationWarning />
			<ScannerClient />
		</>
	);
}
