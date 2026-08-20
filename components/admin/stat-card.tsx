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

export function StatBadge({
    label,
    type = "neutral",
    showIcon = true,
}: StatBadgeProps) {
    const { textColor, bgColor, borderColor, icon: Icon } = STATUS_VARIANTS[type];

    return (
        // <span
        //   className={`inline-flex items-center justify-center gap-1.5 h-[2.625rem] aspect-square text-xs uppercase border rounded-sm ${bgColor} ${textColor} ${borderColor}`}
        //   title={label}
        // >
        //   {showIcon && <Icon className="size-4.5" aria-hidden="true" />}
        //   <span className="sr-only">{label}</span>
        // </span>
        <span className={`font-semibold ${textColor}`}>{label}</span>
    );
}

export function StatCard({
    label,
    value,
    type = "neutral",
    showIcon = true,
}: StatCardProps) {
    const { textColor, bgColor, icon: Icon, fillColor } = STATUS_VARIANTS[type];

    return (
        <section className="bg-white border border-neutral-300 rounded-lg p-6 flex items-center justify-between gap-4">
            <div className="grid gap-1">
                <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide">
                    {label}
                </h2>
                <p className={`text-4xl font-bold ${textColor}`}>{value}</p>
            </div>
            {showIcon && (
                <Icon className={`size-10 text-white self-end ${fillColor}`} />
            )}
        </section>
    );
}
