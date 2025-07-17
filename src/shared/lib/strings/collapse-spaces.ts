export function collapseSpaces(str: string) {
    const regex = /\s{2,}/g;

    return str.replace(regex, " ");
}