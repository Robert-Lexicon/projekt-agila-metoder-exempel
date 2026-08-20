import { API_URL } from "@/lib/config";
import { LOWSTOCKTHRESHOLD } from "@/lib/stock";
import type { ProductsResponse } from "@/lib/types";
import { StatCard } from "./stat-card";

export async function StatusBox() {
    const { products }: ProductsResponse = await fetch(
        `${API_URL}/products?_limit=1000`, // Be sure to fetch all to get right values in calculations
    ).then((res) => res.json());

    const totalProducts = products.length;

    const lowStock = products.filter(
        (product) => product.stock && product.stock > 0 && product.stock < LOWSTOCKTHRESHOLD,
    ).length;

    const outOfStock = products.filter((product) => product.stock === 0).length;

    const inStock = products.filter(
        (product) => product.stock && product.stock >= LOWSTOCKTHRESHOLD,
    ).length;

    return (
        <section className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 px-6 md:px-0">
            <StatCard label="Products" value={totalProducts} type="neutral" />
            <StatCard label="In Stock" value={inStock} type="success" />
            <StatCard label="Low Stock" value={lowStock} type="warning" />
            <StatCard label="Out of Stock" value={outOfStock} type="error" />
        </section>
    );
}
