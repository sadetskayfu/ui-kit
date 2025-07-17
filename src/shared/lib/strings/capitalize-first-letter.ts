export function capitalizeFirstLetter(str: string) {
    const firstLetter = str.charAt(0).toLocaleUpperCase()

    return firstLetter + str.slice(1)
}