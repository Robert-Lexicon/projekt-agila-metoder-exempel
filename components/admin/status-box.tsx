import { cacheLife, cacheTag } from "next/cache";
import { getProducts } from "@/lib/api";
import { LOWSTOCKTHRESHOLD } from "@/lib/stock";
import { StatCard } from "./stat-card";

export async function StatusBox() {
    'use cache';
    cacheLife('hours');          // Uses preset profile (cached for 1h, refreshes in bg)
    cacheTag('products-list');   // For on-demand cache invalidations

    const { products } = await getProducts({
        limit: 1000,
    })

    const totalProducts = products.length;

    const lowStock = products.filter(
        (product) => product.stock && product.stock > 0 && product.stock < LOWSTOCKTHRESHOLD,
    ).length;

    const outOfStock = products.filter((product) => product.stock === 0).length;

    const inStock = products.filter(
        (product) => product.stock && product.stock >= LOWSTOCKTHRESHOLD,
    ).length;

    return (
        <section className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <StatCard label="Products" value={totalProducts} type="neutral" />
            <StatCard label="In Stock" value={inStock} type="success" />
            <StatCard label="Low Stock" value={lowStock} type="warning" />
            <StatCard label="Out of Stock" value={outOfStock} type="error" />
        </section>
    );
}
