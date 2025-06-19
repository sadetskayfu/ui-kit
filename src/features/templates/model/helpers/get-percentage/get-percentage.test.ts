import { describe, expect, test } from "@jest/globals";
import { getPercentage } from "./get-percentage";

describe('getPercentage', () => {
    test('Возвращает значение в нужном формате', () => {
        const value1 = 0.043123;
        const value2 = 1
        const value3 = 0.5
        const value4 = 0

        const result1 = getPercentage(value1)
        const result2 = getPercentage(value2)
        const result3 = getPercentage(value3)
        const result4 = getPercentage(value4)

        expect(result1).toBe('4.31%')
        expect(result2).toBe('100%')
        expect(result3).toBe('50%')
        expect(result4).toBe('0%')
    })
})