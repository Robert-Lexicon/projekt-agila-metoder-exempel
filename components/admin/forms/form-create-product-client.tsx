"use client"

import { useRouter } from "next/navigation";
import { createProductZodActionState } from "@/app/admin/actions";
import { ProductForm } from "@/components/admin/forms/product-form";
import { useFormMutation } from "@/components/admin/hooks/use-form-mutation";
import type { Category } from "@/lib/types";

export function CreateFormProductClientInner({ categories }: { categories: Category[] }) {
    const [state, formAction, isPending] = useFormMutation(
        createProductZodActionState,
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

export function CreateFormProductClient({ categories }: { categories: Category[] }) {
    const { bfcacheId } = useRouter(); // To force update the form with cachecomponents
    return <CreateFormProductClientInner key={bfcacheId} categories={categories} />;
}
