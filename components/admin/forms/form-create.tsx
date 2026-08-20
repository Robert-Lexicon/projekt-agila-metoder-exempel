"use client";

import Form from "next/form";
import Link from "next/link";
import { createProductAction } from "@/app/admin/actions";

const style = {
    input: "border p-2 bg-white border-neutral-300 rounded-md",
    label: "font-semibold",
}

export function FormCreateProduct() {
    return (
        <Form action={createProductAction} className="grid gap-4">
            <div className={`grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 items-center [&>label]:${style.label}`}>
                <label htmlFor="title">
                    Title
                </label>
                <input
                    className={style.input}
                    type="text"
                    id="title"
                    name="title"
                    required
                />
                <label htmlFor="brand">
                    Brand
                </label>
                <input
                    className={style.input}
                    type="text"
                    id="brand"
                    name="brand"
                    required
                />
                <label htmlFor="price">
                    Price
                </label>
                <input
                    className={style.input}
                    type="number"
                    min="0.5"
                    step="0.01"
                    id="price"
                    name="price"
                    required
                />
                <label htmlFor="stock">
                    Stock
                </label>
                <input
                    className={style.input}
                    type="number"
                    id="stock"
                    name="stock"
                    required
                />
                <label htmlFor="categoryId">
                    Category ID
                </label>
                <input
                    className={style.input}
                    type="number"
                    id="categoryId"
                    name="categoryId"
                    required
                />
                <label htmlFor="description">
                    Description
                </label>
                <textarea
                    className={style.input}
                    id="description"
                    name="description"
                    minLength={5}
                    maxLength={400}
                    required
                />
                <label htmlFor="thumbnail">
                    Thumbnail
                </label>
                <input
                    className={style.input}
                    type="url"
                    id="thumbnail"
                    name="thumbnail"
                    required
                />
            </div>
            <div className="flex justify-end gap-2">
                <Link
                    href={"/admin"}
                    className="border rounded-lg py-2 px-4 bg-neutral-50 border-neutral-200  hover:bg-neutral-100 transition-colors"
                >
                    Cancel
                </Link>
                <button
                    className="border rounded-lg py-2 px-4 bg-accent text-white border-neutral-200 cursor-pointer hover:bg-warning transition-colors"
                    type="submit"
                >
                    Save
                </button>
            </div>
        </Form>
    );
}
