'use client';

import UnderConstruction from "#components/layout/UnderConstruction";
import { useSearchParams } from "next/navigation";
import OrderPage from "./Menu/OrderPage";

export default function PageContainer() {
	const searchParams = useSearchParams();
	const tab = searchParams.get("tab");

	return (
		<div className="pageContainer">
			{tab === "explore" && <UnderConstruction />}
			{tab === "menu" && <OrderPage />}
			{tab === "reviews" && <UnderConstruction />}
			{tab === "contact" && <UnderConstruction />}
		</div>
	);
}
