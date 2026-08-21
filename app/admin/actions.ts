"use server";

import { updateTag } from "next/cache";

export async function createProductAction(formData: FormData) {
	console.log(formData);
	updateTag("products-list"); // Purges cached status box results immediately
}
