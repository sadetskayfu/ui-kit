import { describe, expect, jest, test } from '@jest/globals';
import { mergeEventHandlers } from './merge-event-handlers';

describe('mergeEventHandlers', () => {
	const mockEvent = { key: 'Enter' } as React.KeyboardEvent<Element>;

	test('Вызывает все обработчики с переданным событием', () => {
		const handler1 = jest.fn();
		const handler2 = jest.fn();
		const mergeHandler = mergeEventHandlers([handler1, handler2]);

		mergeHandler(mockEvent);

		expect(handler1).toHaveBeenCalledWith(mockEvent);
		expect(handler2).toHaveBeenCalledWith(mockEvent);
		expect(handler1).toHaveBeenCalledTimes(1);
		expect(handler2).toHaveBeenCalledTimes(1);
	});

	test('Игнорирует undefined обработчики', () => {
		const handler1 = jest.fn();
		const handler2 = undefined;
		const mergedHandler = mergeEventHandlers([handler1, handler2]);

		mergedHandler(mockEvent);

		expect(handler1).toHaveBeenCalledWith(mockEvent);
		expect(handler1).toHaveBeenCalledTimes(1);
	});

	test('Не вызывает обработчики, если массив пустой', () => {
		const mergedHandler = mergeEventHandlers([]);

		expect(() => mergedHandler(mockEvent)).not.toThrow();
	});

	test('Вызывает обработчики в порядке их передачи', () => {
		const calls: string[] = [];
		const handler1 = jest.fn(() => calls.push('handler1'));
		const handler2 = jest.fn(() => calls.push('handler2'));
		const mergedHandler = mergeEventHandlers([handler1, handler2]);

		mergedHandler(mockEvent);

		expect(calls).toEqual(['handler1', 'handler2']);
	});

	test('Передаёт событие в обработчики в DOM-контексте', () => {
		const handler1 = jest.fn();
		const handler2 = jest.fn();
		const mergedHandler = mergeEventHandlers([handler1, handler2]);

		const div = document.createElement('div');
		div.addEventListener('keydown', mergedHandler);
		const event = new KeyboardEvent('keydown', { key: 'Enter' });
		div.dispatchEvent(event);

		expect(handler1).toHaveBeenCalledWith(expect.objectContaining({ key: 'Enter' }));
		expect(handler2).toHaveBeenCalledWith(expect.objectContaining({ key: 'Enter' }));
		expect(handler1).toHaveBeenCalledTimes(1);
		expect(handler2).toHaveBeenCalledTimes(1);
	});
});
