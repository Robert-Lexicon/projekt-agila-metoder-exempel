// components/admin/product-inventory-table.tsx

import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { StatBadge } from "@/components/admin/stat-card";
import Pagination from "@/components/navigation/pagination";
import { getProducts } from "@/lib/api";
import { getProductStockStatus, STOCK_FILTERS, type StockStatusKey } from "@/lib/stock";
import { formatPrice } from "@/lib/utils";

const DEFAULT_LIMIT = 8;

interface TableProps {
    searchParams: Promise<{
        page?: string;
        limit?: string;
        category?: string;
        stock?: string;
        q?: string;
        [key: string]: string | undefined;
    }>;
}

export async function ProductTable({
    searchParams,
}: TableProps) {
    const params = await searchParams;

    const page = parseInt(params.page || "1", 10);
    const limit = parseInt(params.limit || DEFAULT_LIMIT.toString(), 10);
    const categoryId = params.category;
    const q = params.q

    const stockConfig = params.stock ? STOCK_FILTERS[params.stock as StockStatusKey] : undefined;

    const { products, total, pages } = await getProducts({
        page,
        limit,
        sort: "id",
        order: "desc",
        expand: "category",
        q,
        categoryId,
        ...stockConfig?.params,
    });

    return (
        <div className="border border-neutral-300 rounded-lg overflow-hidden divide-y divide-neutral-200">
            <div className="overflow-x-auto">
                <table className="w-full min-w-140 divide-y divide-neutral-200">
                    <thead className="text-neutral-500 bg-neutral-50 text-sm text-left [&>tr>*]:px-2 md:[&>tr>*]:px-4">
                        <tr>
                            <th scope="col" className="py-4">Title</th>
                            <th scope="col" className="text-left">Category</th>
                            {/* <th scope="col" className="text-right whitespace-nowrap">Rating</th> */}
                            <th scope="col" className="text-right whitespace-nowrap">Stock</th>
                            <th scope="col" className="text-right whitespace-nowrap">Price</th>
                            <th scope="col" className="text-center w-28 whitespace-nowrap">Actions</th>
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
                                        <h2 className="font-bold leading-tight text-sm md:text-base">{product.title}</h2>
                                        <p className="text-xs font-normal text-neutral-400 hidden md:inline leading-none">
                                            SKU: {product.sku}
                                        </p>
                                    </div>
                                </th>
                                {/* <td>
                                            <span>{product.brand}</span>
                                        </td> */}
                                <td>
                                    <p className="text-sm md:text-base leading-tight">{product.category?.name}</p>
                                </td>
                                {/* <td className="text-right">
                                                <span>
                                                    {product.rating}
                                                </span>
                                            </td> */}
                                <td className="text-right">
                                    <StatBadge label={label} type={type} value={product.stock} />
                                </td>
                                <td className="font-semibold text-right">
                                    <span className="text-sm md:text-base">{formatPrice(product.price)}</span>
                                </td>
                                <td>
                                    <div className="flex justify-end gap-1">
                                        <Link
                                            href={`/admin`}
                                            className="flex justify-center p-2 cursor-pointer disabled:cursor-not-allowed hover:text-error duration-300 ease-out transition-colors"
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
            </div>

            {/* Pagination Controls */}
            <div className="bg-neutral-50 py-4 flex flex-col gap-4 justify-center items-center">
                <Pagination currentPage={page} pages={pages} searchParams={params} />
                <span className="text-sm text-neutral-500">
                    Showing {(page - 1) * limit + 1}-{(page - 1) * limit + limit} of {total} products
                </span>
            </div>
        </div>
    );
}
