"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function useHighlightMenuItem() {
	const searchParams = useSearchParams();

	useEffect(() => {
		const highlightId = searchParams.get("highlight");
		if (!highlightId) return;

		const element = document.getElementById(highlightId);
		if (!element) return;

		setTimeout(() => {
			element.scrollIntoView({ behavior: "smooth", block: "center" });
			element.classList.add("highlight-pulse");

			setTimeout(() => {
				element.classList.remove("highlight-pulse");
			}, 2000);
		}, 300);
	}, [searchParams]);
}
