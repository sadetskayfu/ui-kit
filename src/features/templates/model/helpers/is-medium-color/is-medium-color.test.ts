import { describe, expect, test } from "@jest/globals";
import { isMediumColor } from "./is-medium-color";

describe('isMainColor', () => {
    test('Определяет что переменная цвета является средней в этом цвете', () => {
        const mediumColor = '--color-primary-500'
        const otherColor = '--color-primary-400'

        const result1 = isMediumColor(mediumColor)
        const result2 = isMediumColor(otherColor)

        expect(result1).toBe(true)
        expect(result2).toBe(false)
    })
})