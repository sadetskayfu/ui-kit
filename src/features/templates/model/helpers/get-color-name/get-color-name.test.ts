import { describe, expect, test } from "@jest/globals";
import { getColorName } from "./get-color-name";

describe('getColorName', () => {
    test('Извлекает название цвета из переменной', () => {
        const variable1 = '--color-primary-500'
        const variable2 = '--color-red-400'
        const variable3 = '--invalid-color'
 
        const result1 = getColorName(variable1)
        const result2 = getColorName(variable2)
        const result3 = getColorName(variable3)
  
        expect(result1).toBe('primary')
        expect(result2).toBe('red')
        expect(result3).toBe(null)
    })
})