export const getLastSelectedValue = (selectedValue: string | string[]): string => {
    let lastSelectedValue: string

    if(Array.isArray(selectedValue)) {
        lastSelectedValue = selectedValue[selectedValue.length - 1]
    } else {
        lastSelectedValue = selectedValue
    }

    return lastSelectedValue
}

