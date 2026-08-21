import { getProducts } from "@/lib/api";

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
      <div>{products.map((product) => <h2 key={product.id}>{product.title} - {product.category?.name}</h2>)}</div>
    </main>
  );
}