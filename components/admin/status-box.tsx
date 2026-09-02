import { cacheLife, cacheTag } from "next/cache";
import { getProductStats } from "@/lib/api";
import { StatCard } from "./stat-card";

export async function StatusBox() {
	"use cache";
	cacheLife("hours"); // Preset profile (cached for 1h, background revalidation)
	cacheTag("products-list"); // Tag for on-demand cache invalidation

	const { total, inStock, lowStock, outOfStock } = await getProductStats();

	return (
		<section className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
			<StatCard label="Products" value={total} type="neutral" />
			<StatCard label="In Stock" value={inStock} type="success" />
			<StatCard label="Low Stock" value={lowStock} type="warning" />
			<StatCard label="Out of Stock" value={outOfStock} type="error" />
		</section>
	);
}
