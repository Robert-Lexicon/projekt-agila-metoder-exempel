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
