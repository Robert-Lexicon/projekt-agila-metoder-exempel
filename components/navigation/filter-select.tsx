"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { createQueryStringClient } from "@/lib/utils";

export interface Option {
    label: string;
    value: string | number;
}

interface FilterSelectProps {
    paramKey: string;
    label: string;
    options: Option[];
    defaultValue?: string;
    resetPageOnSelect?: boolean;
}

export default function FilterSelect({
    paramKey,
    label,
    options,
    defaultValue = "",
    resetPageOnSelect = true,
}: FilterSelectProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    //const pathname = usePathname();

    const currentValue = searchParams.get(paramKey) ?? defaultValue;

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = event.target.value;
        const query = createQueryStringClient(searchParams, {
            [paramKey]: newValue,
            ...(resetPageOnSelect ? { page: undefined } : {}),
        });

        //TODO: alternatively remove pathname and use relative paths
        router.push(`?${query}`, { scroll: false });
        // router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
    };

    const id = `${paramKey}-select`;

    return (
        <div className="flex flex-col gap-2 flex-1">
            <label htmlFor={id} className="text-neutral-500 text-sm font-semibold">
                {label}
            </label>
            <select
                className="min-w-[20ch] border border-neutral-300 rounded py-2 px-3"
                id={id}
                name={paramKey}
                onChange={handleChange}
                value={currentValue}
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
}