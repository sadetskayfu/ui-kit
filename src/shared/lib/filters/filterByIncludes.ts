export const filterByIncludes = (optionValue: string, searchValue: string): boolean => {
    return optionValue.toLowerCase().includes(searchValue.toLowerCase())
}