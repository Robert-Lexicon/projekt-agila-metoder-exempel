
import Link from "next/link";
import { Suspense } from "react";
import { ProductTable } from "@/components/admin/product-table";
import {
    AdminFiltersSkeleton,
    ProductTableSkeleton,
    StatusBoxSkeleton,
} from "@/components/admin/skeletons";
import { StatusBox } from "@/components/admin/status-box";
import { AdminFilters } from "@/components/navigation/admin-filters";

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
    return (
        <main className="pb-10">
            <article className="space-y-8 [&>*:not(:first-child)]:px-4 md:[&>*:not(:first-child)]:px-2">
                <header className="bg-white border-b border-neutral-300">
                    <div className="container mx-auto flex justify-between items-start gap-2 py-5 px-4 md:px-2">
                        <div>
                            <h1 className="text-2xl font-bold leading-none mb-1.5 text-balance">Inventory Management</h1>
                            <p className="text-neutral-500 leading-tight text-pretty">
                                Manage and track your global product catalogue across all categories
                            </p>
                        </div>
                        <Link
                            href="/admin/products/create"
                            className="flex items-center gap-3 border rounded-lg px-4 py-1 bg-indigo-500 text-white hover:bg-blue-900 transition-colors whitespace-nowrap"
                        >
                            <span className="text-2xl mb-1 font-bold" aria-hidden="true">+</span>Add Product
                        </Link>
                    </div>
                </header>
                <Suspense fallback={<StatusBoxSkeleton />}>
                    <StatusBox />
                </Suspense>
                <section className="container mx-auto mb-8">
                    <Suspense fallback={<AdminFiltersSkeleton />}>
                        <AdminFilters />
                    </Suspense>
                </section>
                <section className="container mx-auto">
                    <Suspense fallback={<ProductTableSkeleton />}>
                        <ProductTable searchParams={searchParams} />
                    </Suspense>
                </section>
            </article>
        </main>
    )
}
