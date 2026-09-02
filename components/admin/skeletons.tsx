/**
 * A generic skeleton pulse component using Tailwind's animate-pulse.
 */
const SkeletonBase = ({ className }: { className?: string }) => (
	<div className={`animate-pulse bg-neutral-200 rounded ${className}`} />
);

/**
 * Skeleton for the StatCard used in StatusBox.
 */
export function StatCardSkeleton() {
	return (
		<div className="p-6 border border-neutral-300 rounded-lg bg-white flex flex-col gap-2">
			{/* Label */}
			<SkeletonBase className="h-3 w-24" />
			{/* Value */}
			<SkeletonBase className="h-8 w-16 mt-auto" />
		</div>
	);
}

/**
 * Skeleton for the StatusBox.
 */
export function StatusBoxSkeleton() {
	return (
		<section className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
			<StatCardSkeleton />
			<StatCardSkeleton />
			<StatCardSkeleton />
			<StatCardSkeleton />
		</section>
	);
}

/**
 * Skeleton for the AdminFilters section.
 */
export function AdminFiltersSkeleton() {
	return (
		<div className="container mx-auto flex flex-wrap gap-4 justify-between items-end p-6 bg-white border border-neutral-300 rounded-lg">
			{/* Search input */}
			<SkeletonBase className="h-10 flex-1 ml-auto" />
			{/* Filter selects */}
			<SkeletonBase className="h-10 w-46" />
			<SkeletonBase className="h-10 w-46" />
			<SkeletonBase className="h-10 w-46" />
			{/* Reset button */}
			<SkeletonBase className="h-10 w-20" />
		</div>
	);
}

/**
 * Skeleton for the ProductTable.
 */
export function ProductTableSkeleton() {
	return (
		<div className="border border-neutral-300 rounded-lg overflow-hidden divide-y divide-neutral-200">
			<div className="overflow-x-auto">
				<table className="w-full min-w-140 divide-y divide-neutral-200">
					<thead className="text-neutral-500 bg-neutral-50 text-sm text-left">
						<tr>
							<th className="py-4 px-4"></th>
							<th className="px-4"></th>
							<th className="text-right px-4"></th>
							<th className="text-right px-4"></th>
							<th className="text-center w-28 px-4"></th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-neutral-200">
						{[...Array(5)].map((_, i) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: static skeleton placeholder
							<tr key={i}>
								<td className="py-4 px-4">
									<div className="flex gap-3 items-center">
										{/* Image */}
										<SkeletonBase className="h-12 w-12 rounded-sm" />
										<div className="space-y-2">
											{/* Title & SKU */}
											<SkeletonBase className="h-4 w-32" />
											<SkeletonBase className="h-3 w-20" />
										</div>
									</div>
								</td>
								<td className="px-4">
									{/* Category */}
									<SkeletonBase className="h-4 w-20" />
								</td>
								<td className="px-4">
									{/* Price */}
									<div className="flex justify-end">
										<SkeletonBase className="h-6 w-12" />
									</div>
								</td>
								<td className="px-4">
									{/* Stock */}
									<div className="flex justify-end">
										<SkeletonBase className="h-6 w-16" />
									</div>
								</td>
								<td className="px-4">
									{/* Actions */}
									<div className="flex justify-end gap-1">
										<SkeletonBase className="h-8 w-8 rounded-sm" />
										<SkeletonBase className="h-8 w-8 rounded-sm" />
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
