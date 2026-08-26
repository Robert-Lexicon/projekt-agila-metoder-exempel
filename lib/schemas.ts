import z from "zod";

// Define a reusable numeric field that accepts string or number as input
const NumericField = z.union([z.string(), z.number()]).pipe(z.coerce.number());

// Our zod schema which both convert and validate our data
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
