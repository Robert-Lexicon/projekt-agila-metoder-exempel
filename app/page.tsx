import { getProducts } from "@/lib/api";

// Note: This root page is unused in this project; primary focus is on the /admin routes.
// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

const defaultLimit = "16";

export default async function Home() {
	const { products } = await getProducts({
		limit: defaultLimit,
		sort: "title",
		order: "asc",
		expand: "category",
	});

	return (
		<main>
			<h1>Products</h1>
			<div>
				{products.map((product) => (
					<h2 key={product.id}>
						{product.title} - {product.category?.name}
					</h2>
				))}
			</div>
		</main>
	);
}
