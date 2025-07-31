export function getDigits(str: string): undefined | number[] {
    const digits = str.match(/\d+/g)

    if (digits && digits.length > 0) {
        return digits.map((value) => Number(value))
    }
}