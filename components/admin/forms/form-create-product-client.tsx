"use client"

import { useRouter } from "next/navigation";
import { useActionState } from "react";
import toast from "react-hot-toast";
import { createProductZodActionState } from "@/app/admin/actions";
import { ProductForm } from "@/components/admin/forms/product-form";
import type { ActionState, Category, ProductInputData } from "@/lib/types";

const initialState: ActionState<ProductInputData> = null;

function CreateFormProductClientInner({ categories }: { categories: Category[] }) {
    const router = useRouter();

    const [state, formAction, isPending] = useActionState(
        async (prevState: ActionState<ProductInputData>, formData: FormData) => {
            // 1. Call the Server Action asynchronously
            const result = await createProductZodActionState(prevState, formData);

            // 2. Perform client-side side effects directly in the action flow
            if (result?.errors || result?.status === "error") {
                toast.error(result.message || "Please correct the errors.");
            } else {
                toast.success(result?.message || "Product created successfully!");
                router.push("/admin"); // Redirect cleanly on the client
            }

            // 3. Return the new state
            return result;
        },
        initialState,
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
