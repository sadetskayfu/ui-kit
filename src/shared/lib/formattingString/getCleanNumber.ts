export const getCleanNumber = (str: string) => {
    return str.replace(/[^\d.-]/g, '');
}