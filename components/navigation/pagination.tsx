import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { createQueryString } from "@/lib/utils";

function PaginationLink({
    query,
    current,
    children,
}: {
    query: string;
    current?: boolean;
    children: React.ReactNode;
}) {
    return (
        <Link
            className={`inline-flex items-center justify-center p-1 min-h-11 min-w-11 font-bold text-lg border border-neutral-300 rounded transition-colors ${current ? "bg-neutral-500 text-white" : "bg-white hover:border-indigo-600 hover:text-indigo-600 "
                }`}
            // we use href here directly since this makes it more cleaner in this case.
            // If we don't specify the pathname it will use the current path, whatever this is
            href={`?${query}`}
        >
            {children}
        </Link>
    );
}

export default function Pagination({
    currentPage,
    pages,
    searchParams,
}: {
    currentPage: number;
    pages: number;
    searchParams: Record<string, string | string[] | undefined>;
}) {
    const getPageUrl = (page: number) => {
        const query = createQueryString(searchParams, { page });
        return query;
    };

    if (pages <= 1) return null;

    return (
        <div className="text-center">
            <nav
                aria-label="Pagination"
                className="flex flex-wrap gap-2 items-center justify-center"
            >
                {currentPage > 1 && (
                    <PaginationLink
                        query={createQueryString(searchParams, { page: currentPage - 1 })}
                    >
                        <ChevronLeft />
                    </PaginationLink>
                )}
                {[...Array(pages)].map((_, i) => {
                    const pageNr = i + 1;
                    return (
                        <PaginationLink
                            key={pageNr}
                            query={getPageUrl(pageNr)}
                            current={currentPage === pageNr}
                        >
                            {pageNr}
                        </PaginationLink>
                    );
                })}
                {currentPage < pages && (
                    <PaginationLink
                        query={createQueryString(searchParams, { page: currentPage + 1 })}
                    >
                        <ChevronRight />
                    </PaginationLink>
                )}
            </nav>
        </div>
    );
}
