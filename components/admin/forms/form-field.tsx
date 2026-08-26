import type { ComponentPropsWithoutRef } from "react";

interface FieldWrapperProps {
	label: string;
	id?: string;
	error?: string | string[];
	children: React.ReactNode;
}

export function FieldWrapper({
	label,
	id,
	error,
	children,
}: FieldWrapperProps) {
	const hasError = Array.isArray(error) ? error.length > 0 : Boolean(error);
	return (
		<>
			<label className="font-semibold" htmlFor={id}>
				{label}
			</label>
			<div>
				{children}
				{hasError && (
					<div
						id={`${id}-error`}
						role="alert"
						className="mt-1 text-xs text-red-500"
					>
						{Array.isArray(error) ? (
							error.length > 1 ? (
								<ul className="list-disc pl-4 space-y-0.5">
									{error.map((err, i) => (
										<li
											key={`${err}-${
												// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
												i
												}`}
										>
											{err}
										</li>
									))}
								</ul>
							) : (
								error[0]
							)
						) : (
							error
						)}
					</div>
				)}
			</div>
		</>
	);
}

const baseStyles = "border bg-white p-2 rounded-md w-full";

export function FormInput({
	label,
	id,
	error,
	className = "",
	...props
}: {
	label: string;
	error?: string | string[];
} & ComponentPropsWithoutRef<"input">) {
	return (
		<FieldWrapper label={label} id={id} error={error}>
			<input id={id} className={`${baseStyles} ${className}`} {...props} />
		</FieldWrapper>
	);
}

export function FormTextarea({
	label,
	id,
	error,
	className = "",
	...props
}: {
	label: string;
	error?: string | string[];
} & ComponentPropsWithoutRef<"textarea">) {
	return (
		<FieldWrapper label={label} id={id} error={error}>
			<textarea id={id} className={`${baseStyles} ${className}`} {...props} />
		</FieldWrapper>
	);
}

export function FormSelect({
	label,
	id,
	error,
	className = "",
	children,
	...props
}: { label: string; error?: string[] } & ComponentPropsWithoutRef<"select">) {
	return (
		<FieldWrapper label={label} id={id} error={error}>
			<select id={id} className={`${baseStyles} ${className}`} {...props}>
				{children}
			</select>
		</FieldWrapper>
	);
}
