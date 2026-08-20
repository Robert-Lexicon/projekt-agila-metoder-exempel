import { FormCreateProduct } from "@/components/admin/forms/form-create";

export default function CreatePage() {
    return (
        <main>
            <article className="space-y-8">
                <header className="bg-white border-b border-neutral-200 ">
                    <div className="container mx-auto flex justify-between items-center py-5 px-6 md:px-0">
                        <div>
                            <h1 className="text-2xl font-bold">Create Product</h1>
                        </div>
                    </div>
                </header>
                <div className="container mx-auto space-y-4">
                    <FormCreateProduct />
                </div>
            </article>
        </main>
    );
}
