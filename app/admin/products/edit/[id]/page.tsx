import { notFound } from "next/navigation";
import { Suspense } from "react";
import { FormEditProductZod } from "@/components/admin/forms/form-edit-action-state";
import { getCategories, getProduct } from "@/lib/api";

async function EditFormLoader({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const [product, categories] = await Promise.all([
		getProduct(id),
		getCategories(),
	]);

	if (!product) {
		notFound();
	}
	return <FormEditProductZod product={product} categories={categories} />;
}

export default async function EditPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	return (
		<main>
			<article className="space-y-8">
				<header className="bg-white border-b border-neutral-200 ">
					<div className="container mx-auto flex justify-between items-center py-5 px-6 md:px-0">
						<div>
							<h1 className="text-2xl font-bold">Edit Product</h1>
						</div>
					</div>
				</header>
				<div className="container mx-auto space-y-4">
					<Suspense fallback={<p>Loading...</p>}>
						<EditFormLoader params={params} />
					</Suspense>
				</div>
			</article>
		</main>
	);
}
