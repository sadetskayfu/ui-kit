type Mods = Record<string, boolean | undefined>

export function classNames(
	mainClass: string | undefined,
	additionalClasses: Array<string | undefined> = [],
	mods: Mods = {}
) {
	return [
		mainClass,
		...additionalClasses.filter(Boolean),
		...Object.entries(mods)
			.filter(([_, value]) => Boolean(value))
			.map(([className]) => className),
	].join(' ')
}