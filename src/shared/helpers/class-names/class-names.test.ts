import { describe, expect, test } from '@jest/globals';
import { classNames } from './class-names';

describe('classNames', () => {
	test('Возвращает mainClass, если нет дополнительных классов и модов', () => {
		const result = classNames('main-class');
		expect(result).toBe('main-class');
	});

	test('Добовляет дополнительные классы', () => {
		const result = classNames('main-class', ['add-class-1', 'add-class-2']);
		expect(result).toBe('main-class add-class-1 add-class-2');
	});

	test('Игнорирует undefine и null в дополнительных классах', () => {
		const result = classNames('main-class', [undefined, null, 'add-class-1']);
		expect(result).toBe('main-class add-class-1');
	});

	test('Добавляет классы из модов, если их значение true', () => {
		const mods: Record<string, boolean | undefined> = {
			'mod-class-1': true,
			'mod-class-2': false,
			'mod-class-3': undefined,
			'mod-class-4': true,
		};
		const result = classNames('main-class', [], mods);
		expect(result).toBe('main-class mod-class-1 mod-class-4');
	});

	test('Обрабатывает случай, когда mainClass undefined', () => {
		const result = classNames(undefined, ['add-class'], { 'mod-class': true });
		expect(result).toBe('add-class mod-class');
	});

	test('Обрабатывает случай, когда mainClass null', () => {
		const result = classNames(null, ['add-class'], { 'mod-class': true });
		expect(result).toBe('add-class mod-class');
	});
});
