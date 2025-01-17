export const getCorrectedValueWithRange = (minThumbValue: number, maxThumbValue: number, minRange: number, activeThumbIndex: 0 | 1) => {
    if(activeThumbIndex === 0 ) {
        if(minThumbValue + minRange >= maxThumbValue) {
            return maxThumbValue - minRange
        } else {
            return minThumbValue
        }
    }
    if(activeThumbIndex === 1) {
        if(maxThumbValue - minRange <= minThumbValue) {
            return minThumbValue + minRange
        } else {
            return maxThumbValue
        }
    }
}