import { useRouter } from "next/navigation";
import { useActionState } from "react";
import toast from "react-hot-toast";
import type { ActionState } from "@/lib/types";

export function useFormMutation<TData>(
	actionFn: (
		prevState: ActionState<TData>,
		formData: FormData,
	) => Promise<ActionState<TData>>,
	initialState: ActionState<TData>,
	options?: {
		redirectTo?: string;
		successMessage?: string;
	},
) {
	const router = useRouter();
	const [state, formAction, isPending] = useActionState(
		async (prevState: ActionState<TData>, formData: FormData) => {
			const result = await actionFn(prevState, formData);
			if (result?.status === "error" || result?.errors) {
				toast.error(result.message || "Please correct the errors.");
			} else if (result?.status === "success") {
				toast.success(result.message || options?.successMessage || "Saved!");
				if (options?.redirectTo) {
					router.push(options.redirectTo);
				}
			}
			return result;
		},
		initialState,
	);

	return [state, formAction, isPending] as const;
}
