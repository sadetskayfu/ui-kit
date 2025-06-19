export function getColorName(variable: string) {
    const regex = /--color-([a-zA-Z]+)-(\d+)/;
    const match = variable.match(regex);

    return match ? match[1] : null;
}