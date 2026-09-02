/**
 * Product presentation module.
 *
 * Stock-status classification and price formatting — everything a caller
 * needs to display a product's stock and price in the UI.
 *
 * Shared (isomorphic) — safe to import from both server and client modules.
 */

// ── Stock status ──────────────────────────────────────────────────────

export const LOWSTOCKTHRESHOLD = 10;

export const STOCK_FILTERS = {
	"in-stock": {
		label: "In Stock",
		type: "success" as const,
		params: { stock_gte: LOWSTOCKTHRESHOLD },
	},
	"low-stock": {
		label: "Low Stock",
		type: "warning" as const,
		params: { stock_gte: 1, stock_lte: LOWSTOCKTHRESHOLD - 1 },
	},
	"out-of-stock": {
		label: "Out of Stock",
		type: "error" as const,
		params: { stock_lte: 0 },
	},
} as const;

export type StockStatusKey = keyof typeof STOCK_FILTERS;

export function getProductStockStatus(stock: number | undefined | null) {
	if (stock === undefined || stock === null || stock <= 0) {
		return STOCK_FILTERS["out-of-stock"];
	}
	if (stock < LOWSTOCKTHRESHOLD) {
		return STOCK_FILTERS["low-stock"];
	}
	return STOCK_FILTERS["in-stock"];
}

// ── Price formatting ──────────────────────────────────────────────────

/**
 * Calculates the final price after a discount percentage is applied.
 * Returns the original price if no discount is provided or if discount is 0.
 */
export function calculateDiscountedPrice(
	price: number,
	discountPercentage?: number,
): number {
	if (!discountPercentage || discountPercentage <= 0) {
		return price;
	}
	const discountAmount = price * (discountPercentage / 100);
	return price - discountAmount;
}

/**
 * Formats a number as a currency string with the Euro symbol.
 * Example: 1899.99 -> €1,899.99 or €1,900 depending on locale
 */
const priceFormatter = new Intl.NumberFormat("en-IE", {
	style: "currency",
	currency: "EUR",
	minimumFractionDigits: 2,
	maximumFractionDigits: 2,
});

export function formatPrice(price: number): string {
	return priceFormatter.format(price);
}
