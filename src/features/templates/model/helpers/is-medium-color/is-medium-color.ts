export function isMediumColor(variable: string) {
    const regex = /--color-[a-zZ-Z]+-500/
    return regex.test(variable)
}