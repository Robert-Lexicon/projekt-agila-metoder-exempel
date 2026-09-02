import { CircleCheck, CircleX, Package2, TriangleAlert } from "lucide-react";

export type StatusType = "neutral" | "warning" | "error" | "success";

interface StatCardProps {
	label: string;
	value: number | string;
	type?: StatusType;
	showIcon?: boolean;
}

interface StatBadgeProps {
	label?: string;
	value?: number | string;
	type?: StatusType;
	showIcon?: boolean;
}

const STATUS_VARIANTS = {
	neutral: {
		textColor: "text-indigo-500",
		bgColor: "bg-indigo-100",
		borderColor: "border-indigo-200",
		fillColor: "fill-indigo-500",
		icon: Package2,
	},
	warning: {
		textColor: "text-amber-600", // or text-warning
		bgColor: "bg-amber-100", // or bg-warning/10
		borderColor: "border-amber-200",
		fillColor: "fill-amber-600",
		icon: TriangleAlert,
	},
	error: {
		textColor: "text-red-500",
		bgColor: "bg-red-50",
		borderColor: "border-red-200",
		fillColor: "fill-red-500",
		icon: CircleX,
	},
	success: {
		textColor: "text-green-600",
		bgColor: "bg-green-100",
		borderColor: "border-green-200",
		fillColor: "fill-green-600",
		icon: CircleCheck,
	},
};

export function StatBadge({ label, value, type = "neutral" }: StatBadgeProps) {
	const { textColor } = STATUS_VARIANTS[type];

	return (
		<>
			{/* Mobile: Dot indicator + Screen Reader only text */}
			<div className="flex gap-1 items-center justify-end">
				<span className={`inline-flex items-center lg:hidden ${textColor}`}>
					<svg
						className="h-3 w-3 fill-current"
						viewBox="0 0 16 16"
						aria-hidden="true"
						focusable="false"
					>
						<circle cx="8" cy="8" r="8" />
					</svg>
					<span className="sr-only">{label}</span>
				</span>

				{/* Desktop: Visible label text */}
				<span className={`hidden font-semibold lg:inline ${textColor}`}>
					{label}
				</span>
				<span className="min-w-8 text-sm md:text-base tabular-nums lg:before:content-['('] lg:after:content-[')']">
					{value}
				</span>
			</div>
		</>
	);
}

export function StatCard({
	label,
	value,
	type = "neutral",
	showIcon = true,
}: StatCardProps) {
	const { textColor, icon: Icon, fillColor } = STATUS_VARIANTS[type];

	return (
		<section className="bg-white border border-neutral-300 rounded-lg p-6 grid items-center">
			<h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide whitespace-nowrap">
				{label}
			</h2>
			<div className="flex justify-between items-center">
				<p className={`text-4xl font-bold ${textColor}`}>{value}</p>

				{showIcon && (
					<Icon
						aria-hidden="true"
						className={`size-10 text-white self-end ${fillColor}`}
					/>
				)}
			</div>
		</section>
	);
}
