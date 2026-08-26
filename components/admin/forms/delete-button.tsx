// Alternative to the useFormStat that uses useTransition directly in the component

import { LoaderCircle, Trash2 } from "lucide-react";
import { useTransition } from "react";
import toast from "react-hot-toast";
import { deleteProductFromClientAction } from "@/app/admin/actions";

export function DeleteButton({ id }: { id: number }) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        startTransition(async () => {
            const success = await deleteProductFromClientAction(id);
            if (!success) {
                toast.error("Product not deleted");
            } else {
                toast.success("Product deleted");
            }
        });
    };

    return (
        <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="p-2 text-neutral-500 hover:text-red-600 transition-colors disabled:opacity-50"
            aria-label="Delete product"
        >
            {isPending ? (
                <LoaderCircle className="animate-spin h-5 w-5" />
            ) : (
                <Trash2 className="h-5 w-5" />
            )}
        </button>
    );
}
