"use client"

import { useRouter } from "next/navigation";
import { createProductActionState } from "@/app/admin/actions";
import { ProductForm } from "@/components/admin/forms/product-form";
import { useFormMutation } from "@/components/admin/hooks/use-form-mutation";
import type { Category } from "@/lib/types";

export function CreateFormProductInner({ categories }: { categories: Category[] }) {
    const [state, formAction, isPending] = useFormMutation(
        createProductActionState,
        null,
        { redirectTo: "/admin", successMessage: "Product created!" }
    );
    return (
        <ProductForm
            action={formAction}
            state={state}
            isPending={isPending}
            categories={categories}
        />
    );
}

export function CreateFormProduct({ categories }: { categories: Category[] }) {
    const { bfcacheId } = useRouter(); // To force update the form with cachecomponents
    return <CreateFormProductInner key={bfcacheId} categories={categories} />;
}
