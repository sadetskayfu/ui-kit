import { describe, expect, test } from '@jest/globals';
import { getOffset } from './get-offset';

describe('getOffset', () => {
	const circumferenceLength = 500;

	test('Вычисляет правильное смещение для 50% прогресса', () => {
		const result = getOffset(50, 0, 100, circumferenceLength);
		expect(result).toBe(circumferenceLength / 2);
	});

	test('Вычисляет правильное смещение для 0% прогресса', () => {
		const result = getOffset(0, 0, 100, circumferenceLength);
		expect(result).toBe(circumferenceLength);
	});

	test('Вычисляет правильное смещение для 100% прогресса', () => {
		const result = getOffset(100, 0, 100, circumferenceLength);
		expect(result).toBe(0);
	});

	test('Вычисляет правильное смещение для 50% прогресса, при minValue > 0', () => {
		const result = getOffset(75, 50, 100, circumferenceLength);
		expect(result).toBe(circumferenceLength / 2);
	});

	test('Вычисляет правильное смещение для 0% прогресса, при minValue > 0', () => {
		const result = getOffset(50, 50, 100, circumferenceLength);
		expect(result).toBe(circumferenceLength);
	});

	test('Вычисляет правильное смещение для 100% прогресса, при minValue > 0', () => {
		const result = getOffset(100, 50, 100, circumferenceLength);
		expect(result).toBe(0);
	});

	test('Вычисляет правильное смещение, при value > maxValue', () => {
		const result = getOffset(110, 0, 100, circumferenceLength);
		expect(result).toBe(0);
	});

	test('Вычисляет правильное смещение, при value < minValue', () => {
		const result = getOffset(-20, 0, 100, circumferenceLength);
		expect(result).toBe(circumferenceLength);
	});

	test('Выдает ошибку, если maxValue === minValue', () => {
		expect(() => getOffset(20, 20, 20, circumferenceLength)).toThrow(
			'maxValue must not equal minValue to avoid division by zero'
		);
	});
});
