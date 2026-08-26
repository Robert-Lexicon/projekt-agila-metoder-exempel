import { cacheLife, cacheTag } from "next/cache";
import { getProductStats } from "@/lib/api";
import { StatCard } from "./stat-card";

export async function StatusBox() {
    'use cache';
    cacheLife('hours');          // Uses preset profile (cached for 1h, refreshes in bg)
    cacheTag('products-list');   // For on-demand cache invalidations

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
