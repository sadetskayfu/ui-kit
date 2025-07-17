export function getLastSelectedValue(selectedValue: string | string[]) {
    if(Array.isArray(selectedValue)) {
        return selectedValue[selectedValue.length - 1]
    } else {
        return selectedValue
    }
}