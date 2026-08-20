import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image"
import Link from "next/link";
import { Suspense } from "react";
import { StatBadge } from "@/components/admin/stat-card";
import { StatusBox } from "@/components/admin/status-box";
import FilterSelect from "@/components/navigation/filter-select";
import Pagination from "@/components/navigation/pagination";
import { getCategories, getProducts } from "@/lib/api";
import { getProductStockStatus, STOCK_FILTERS, StockStatusKey } from "@/lib/stock";
import { formatPrice } from "@/lib/utils";

const DEFAULT_LIMIT = 8;

interface PageProps {
    searchParams: Promise<{
        page?: string;
        limit?: string;
        category?: string;
        stock?: string;
        [key: string]: string | undefined;
    }>;
}

export default async function Home({ searchParams }: PageProps) {
    const params = await searchParams;

    const page = parseInt(params.page || "1", 10);
    const limit = parseInt(params.limit || DEFAULT_LIMIT.toString(), 10);
    const categoryId = params.category;

    const stockConfig = params.stock ? STOCK_FILTERS[params.stock as StockStatusKey] : undefined;

    // Fetch products and categories in parallel
    const [{ products, total, pages }, categories] = await Promise.all([
        getProducts({
            page,
            limit,
            sort: "id",
            order: "desc",
            expand: "category",
            categoryId,
            ...stockConfig?.params,
        }),
        getCategories(),
    ]);

    return (
        <main className="pb-10">
            <article className="space-y-8">
                <header className="bg-white border-b border-neutral-300">
                    <div className="container mx-auto flex justify-between items-center py-5 px-6 md:px-0">
                        <div>
                            <h1 className="text-2xl font-bold">Inventory Management</h1>
                            <span className="text-neutral-500">
                                Manage and track your global product catalogue across all categories
                            </span>
                        </div>
                        <a
                            href="/admin/products/create"
                            className="flex items-center gap-3 border rounded-lg px-4 py-1 bg-indigo-500 text-white hover:bg-blue-900 transition-colors"
                        >
                            <span className="text-2xl mb-1 font-bold">+</span>Add Product
                        </a>
                    </div>
                </header>
                <Suspense fallback={<div className="flex items-center justify-center text-amber-500">
                    <p>Loading stock status...</p>
                </div>}>
                    <StatusBox />
                </Suspense>
                <section className="container mx-auto mb-8 px-6 md:px-0">
                    <form className="flex flex-wrap gap-4 justify-between items-center p-6 bg-white border border-neutral-300 rounded-lg">
                        <div className="flex-2 flex flex-col gap-2 min-w-[20ch]">
                            <label htmlFor="search" className="text-neutral-500 text-sm font-semibold">Search products</label>
                            <input
                                id="search"
                                type="text"
                                placeholder="Search products..."
                                className="w-full border border-neutral-300 rounded py-2 px-3"
                            />
                        </div>
                        <Suspense fallback={<div>...</div>}>
                            <FilterSelect paramKey="category" label="Category" options={[
                                { label: "All", value: "" },
                                ...categories.map((c) => ({ label: c.name, value: c.id })),
                            ]} />

                            <FilterSelect paramKey="stock" label="Stock" options={[
                                { label: "All", value: "" },
                                { label: "In Stock", value: "in-stock" },
                                { label: "Low Stock", value: "low-stock" },
                                { label: "Out of Stock", value: "out-of-stock" }
                            ]} />

                            <FilterSelect
                                paramKey="limit"
                                label="Items/Page"
                                defaultValue="16"
                                options={[
                                    { label: "8", value: "8" },
                                    { label: "16", value: "16" },
                                    { label: "24", value: "24" },
                                    { label: "48", value: "48" },
                                ]}
                            />
                        </Suspense>
                    </form>
                </section>
                <section className="container mx-auto px-6 md:px-0">
                    <div className="border border-neutral-300 rounded-lg overflow-clip divide-y divide-neutral-200">
                        <table className="w-full divide-y divide-neutral-200">
                            <thead className="text-neutral-500 bg-neutral-50 text-sm text-left [&>tr>*]:px-4">
                                <tr>
                                    <th scope="col" className="py-4">
                                        Title
                                    </th>
                                    <th scope="col">Brand</th>
                                    <th scope="col" className="text-left">
                                        Category
                                    </th>
                                    <th scope="col" className="text-right">Rating</th>
                                    <th scope="col" className="text-right">
                                        Stock
                                    </th>

                                    <th scope="col" className="text-right">
                                        Price
                                    </th>
                                    <th scope="col" className="text-center w-32">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-neutral-200 [&>tr>*]:px-2 md:[&>tr>*]:px-4">{products.map((product) => {
                                const { type, label } = getProductStockStatus(product.stock);
                                return (
                                    <tr key={product.id}>
                                        <th
                                            scope="row"
                                            className="text-left py-4 flex gap-3 items-center"
                                        >
                                            <Image
                                                src={product.thumbnail}
                                                className="border border-gray-200 rounded-sm"
                                                alt=""
                                                width={48}
                                                height={48}
                                            />
                                            <div className="grid content-center">
                                                <h2 className="font-bold">{product.title}</h2>
                                                <span className="text-sm font-normal text-neutral-400">
                                                    SKU: {product.sku}
                                                </span>
                                            </div>
                                        </th>
                                        <td>
                                            <span>{product.brand}</span>
                                        </td>
                                        <td>
                                            <span>{product.category?.name}</span>
                                        </td>
                                        <td className="text-right">
                                            <span>
                                                {product.rating}
                                            </span>
                                        </td>
                                        <td className="text-right">
                                            <span>
                                                <StatBadge label={label} type={type} /> (
                                                {product.stock})
                                            </span>
                                        </td>
                                        <td className="font-semibold text-right">
                                            <span>{formatPrice(product.price)}</span>
                                        </td>
                                        <td>
                                            <div className="flex justify-end gap-1">
                                                <Link
                                                    href={`/admin`}
                                                    className="flex justify-center w-full p-2 cursor-pointer disabled:cursor-not-allowed hover:text-error duration-300 ease-out transition-colors"
                                                ><span className="sr-only">Delete</span>
                                                    <Trash2 />
                                                </Link>
                                                <Link
                                                    href={`/admin/products/${product.id}/edit`}
                                                    className="flex justify-center p-2 cursor-pointer disabled:cursor-not-allowed rounded-sm hover:bg-blue-600 hover:text-white duration-200 ease-out transition-colors"
                                                >
                                                    <span className="sr-only">Edit</span>
                                                    <Pencil />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}</tbody>
                        </table>
                        <div className="bg-neutral-50 px-6 py-4 flex flex-col gap-4 justify-center items-center">
                            <Suspense fallback={
                                <div className="flex items-center justify-center text-amber-500">
                                    <p>Loading pagination...</p>
                                </div>
                            }>
                                <Pagination
                                    currentPage={page}
                                    pages={pages}
                                    searchParams={params}
                                />
                            </Suspense>
                            <span className="text-sm text-neutral-500">
                                Showing {(page - 1) * limit + 1}-{(page - 1) * limit + limit} of{" "}
                                {total} products
                            </span>
                        </div>
                    </div>
                </section>

            </article>
        </main>
    )
}
