import z from "zod";

// Reusable numeric field that accepts either a string or number input and coerces it to a number
const NumericField = z.union([z.string(), z.number()]).pipe(z.coerce.number());

// Zod schema that coerces and validates product form data
export const ProductSchema = z.object({
	title: z.string().min(3).max(64),
	brand: z.string().min(1).max(64),
	description: z.string().min(5).max(256),
	thumbnail: z
		.string()
		.transform((val) => encodeURI(val.trim()))
		.pipe(z.url()),
	price: NumericField.pipe(z.number().min(0.01).max(10000)),
	categoryId: NumericField.pipe(
		z.number().int().positive("Category is required"),
	),
	stock: NumericField.pipe(z.number().int().min(0, "Stock cannot be negative")),
	discountPercentage: NumericField.optional().pipe(z.number().min(0).max(100)),
});
