import { describe, expect, jest, test } from '@jest/globals';
import { mergeProps } from './merge-props';

describe('mergeProps', () => {
	const mockKeyboardEvent = { key: 'Enter' } as React.KeyboardEvent<HTMLButtonElement>;
	const mockMouseEvent = { clientX: 5 } as React.MouseEvent<HTMLButtonElement>;
	const mockTouchEvent = { type: 'touch' } as React.TouchEvent<HTMLButtonElement>;

	test('Объединяет обработчики', () => {
		const externalProps = {
			onClick: jest.fn(),
			onKeyDown: jest.fn(),
		};
		const localProps = {
			onClick: jest.fn(),
			onTouchEnd: jest.fn(),
		};

		const mergedProps = mergeProps<'button'>(localProps, externalProps);

		mergedProps.onClick?.(mockMouseEvent);
		mergedProps.onKeyDown?.(mockKeyboardEvent);
		mergedProps.onTouchEnd?.(mockTouchEvent);

		expect(externalProps.onClick).toHaveBeenCalledWith(mockMouseEvent);
		expect(externalProps.onClick).toHaveBeenCalledTimes(1);
		expect(localProps.onClick).toHaveBeenCalledWith(mockMouseEvent);
		expect(localProps.onClick).toHaveBeenCalledTimes(1);

		expect(externalProps.onKeyDown).toHaveBeenCalledWith(mockKeyboardEvent);
		expect(externalProps.onKeyDown).toHaveBeenCalledTimes(1);
		expect(localProps.onTouchEnd).toHaveBeenCalledWith(mockTouchEvent);
		expect(localProps.onTouchEnd).toHaveBeenCalledTimes(1);
	});

	test('Объединяет несколько обработчиков и вызывает в нужном порядке', () => {
		const log: string[] = [];

		const mergedProps = mergeProps<'button'>(
			{
				onClick() {
					log.push('3');
				},
			},
			{
				onClick() {
					log.push('2');
				},
			},
			{
				onClick() {
					log.push('1');
				},
			}
		);

		mergedProps.onClick?.(mockMouseEvent);

		expect(log).toEqual(['1', '2', '3']);
	});

	test('Работает с undefined обработчиком', () => {
		const log: string[] = [];

		const mergedProps = mergeProps<'button'>(
			{
				onClick() {
					log.push('3');
				},
			},
			{
				onClick: undefined,
			},
			{
				onClick() {
					log.push('1');
				},
			}
		);

		mergedProps.onClick?.(mockMouseEvent);

		expect(log).toEqual(['1', '3']);
	});

	test('Объединяет стили', () => {
		const localProps = {
			style: { color: 'blue', backgroundColor: 'blue' },
		};
		const externalProps = {
			style: { color: 'red' },
		};

		const mergedProps = mergeProps<'div'>(localProps, externalProps);

		expect(mergedProps.style).toStrictEqual({ color: 'red', backgroundColor: 'blue' });
	});

	test('Объединяет стили имея undefined', () => {
		const localProps = {};
		const externalProps = {
			style: { color: 'red' },
		};

		const mergedProps = mergeProps<'div'>(localProps, externalProps);

		expect(mergedProps.style).toStrictEqual({ color: 'red' });
	});

	test('Не объединяет стили, если оба пропса undefined', () => {
		const localProps = {};
		const externalProps = {};

		const mergedProps = mergeProps<'div'>(localProps, externalProps);

		expect(mergedProps.style).toEqual(undefined);
	});

	test('Отменяются обработчики которые определены послее вызова event.preventLocalHandler()', () => {
		let ran = false;

		const mergedProps = mergeProps<'button'>(
			{
				onClick: () => {
					ran = true;
				},
			},
			{
				onClick: () => {
					ran = true;
				},
			},
			{
				onClick: event => {
					event.preventLocalHandler?.();
				},
			}
		);

		mergedProps.onClick?.({ nativeEvent: new MouseEvent('click') } as any);

		expect(ran).toBe(false);
	});

	test('Выполняются обработчиик которые определены до вызова event.preventLocalHandler()', () => {
		const log: string[] = [];

		const mergedProps = mergeProps<'button'>(
			{
				onClick: () => {
					log.push('3');
				},
			},
			{
				onClick: event => {
					event.preventLocalHandler?.();
					log.push('2');
				},
			},
			{
				onClick: () => {
					log.push('1');
				},
			}
		);

		mergedProps.onClick?.({ nativeEvent: new MouseEvent('click') } as any);

		expect(log).toStrictEqual(['1', '2']);
	});

	test('Выполняет стандартные обработчики без ошибок', () => {
		const log: string[] = [];

		const mergedProps = mergeProps<any>(
			{
				onValueChange() {
					log.push('2');
				},
			},
			{
				onValueChange() {
					log.push('1');
				},
			}
		);

		mergedProps.onValueChange('string');
		mergedProps.onValueChange(0);
		mergedProps.onValueChange({ key: 'value' });
		mergedProps.onValueChange(['value']);
		mergedProps.onValueChange(() => 'value');

		expect(log.length).toBe(2 * 5);
	});

	test('Merged props таким образом, что те, которые были определены первыми, переопределяют те, которые были определены позже', () => {
		const mergedProps = mergeProps<'button'>(
			{
				title: 'title 2'
			},
			{
				title: 'title 1'
			}
		)

		expect(mergedProps.title).toBe('title 1')
	});

	test('Вызывает props getter с props, которые определы после него', () => {
		let observedProps;
		const propsGetter = jest.fn((props: { [key: string]: string }) => {
			observedProps = {...props}
			return props
		})

		mergeProps(
			{
				id: '2',
				className: 'test-class'
			},
			propsGetter,
			{
				id: '1',
				role: 'button'
			}
		)

		expect(propsGetter).toHaveBeenCalledTimes(1)
		expect(observedProps).toStrictEqual({ id: '2', className: 'test-class' })
	})

	test('Вызывает props getter с merged props, которые определы после него', () => {
		let observedProps;
		const propsGetter = jest.fn((props: { [key: string]: string }) => {
			observedProps = {...props}
			return props
		})

		mergeProps(
			{
				role: 'button',
				id: '2',
			},	
			{
				role: 'list-item',
			},
			propsGetter,
			{
				id: '1',
			}
		)

		expect(propsGetter).toHaveBeenCalledTimes(1)
		expect(observedProps).toStrictEqual({ id: '2', role: 'list-item' })
	})

	test('Вызывает props getter с пустым обьектом, если после него не определены пропсы', () => {
		let observedProps;
		const propsGetter = jest.fn((props: { [key: string]: string }) => {
			observedProps = {...props}
			return props
		})

		mergeProps(
			propsGetter,
			{
				id: '1',
			}
		)

		expect(propsGetter).toHaveBeenCalledTimes(1)
		expect(observedProps).toEqual({})
	})

	test('Принимает результат от props getter', () => {
		const propsGetter = (props: { [key: string]: string }) => ({ className: 'test-class', role: props['role'] })

		const result = mergeProps(
			{
				role: 'button'
			},
			{
				id: '1',
			},
			propsGetter,
		)

		expect(result).toStrictEqual({ className: 'test-class', role: 'button' })
	})
});
