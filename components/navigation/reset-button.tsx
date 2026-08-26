"use client";

import { RotateCcw } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

export default function ResetButton() {
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    const handleReset = () => {
        startTransition(() => {
            router.push(pathname, { scroll: false });
        });
    };

    return (
        <button
            type="button"
            onClick={handleReset}
            disabled={isPending}
            className={`min-h-10.25 flex items-center gap-2 py-2 px-3 text-sm font-semibold border border-neutral-300 rounded bg-white transition-opacity hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-800 ${isPending ? "opacity-50 cursor-not-allowed" : ""
                }`}
        >
            <RotateCcw className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`} />
            Reset
        </button>
    );
}
