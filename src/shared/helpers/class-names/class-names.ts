export type Mods = Record<string, boolean | undefined | null>;
export type AdditionalClasses = Array<string | undefined | null>;

export function classNames(
	mainClass: string | undefined | null,
	additionalClasses: AdditionalClasses = [],
	mods: Mods = {}
) {
	return [
		mainClass,
		...additionalClasses,
		...Object.entries(mods)
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			.filter(([_, value]) => Boolean(value))
			.map(([className]) => className),
	]
		.filter(Boolean)
		.join(' ');
}
