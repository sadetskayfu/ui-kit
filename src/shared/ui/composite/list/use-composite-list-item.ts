import * as React from 'react';
import { useCompositeListContext } from './composite-list-context';
import { useModernLayoutEffect } from '@/shared/hooks';
import { EMPTY_OBJECT } from '@/shared/constants';
import type { CompositeCustomMetadata } from './composite-list';

export interface UseCompositeListItemParams<Metadata extends CompositeCustomMetadata> {
	label?: string | null;
	metadata?: Metadata;
	/**
	 * Пытаться предсказать индекс на основе порядка регистрации элементов. Это полезно для плоских вертикальных списков, где порядок монтирования компонентов совпадает с их окончательным порядком в DOM. Угадывание позволяет сразу вернуть "правильный" индекс, избегая начального значения -1 и дополнительного ререндера после сортировки.
	 * @default true
	 */
	guessIndex?: boolean;
}

export function useCompositeListItem<Metadata extends CompositeCustomMetadata>(params: UseCompositeListItemParams<Metadata> = EMPTY_OBJECT) {
	const { label, metadata, guessIndex = true } = params;

	const { register, unregister, subscribeMapChange, elementsRef, labelsRef, nextIndexRef } =
		useCompositeListContext();

	const indexRef = React.useRef(-1);
	const [index, setIndex] = React.useState<number>(
		guessIndex
			? () => {
					if (indexRef.current === -1) {
						const newIndex = nextIndexRef.current;
						nextIndexRef.current += 1;
						indexRef.current = newIndex;
					}
					return indexRef.current;
				}
			: -1
	);

	const componentRef = React.useRef<HTMLElement | null>(null);

	const ref = React.useCallback(
		(node: HTMLElement | null) => {
			componentRef.current = node;

			if (index !== -1 && node !== null) {
				elementsRef.current[index] = node;

				if (labelsRef) {
					// Сохраняем null, так как длина массива лейблов должна совпадать с длинной массива элементов для правильной навигации
					labelsRef.current[index] = label !== undefined ? label : null;
				}
			}
		},
		[elementsRef, labelsRef, index, label]
	);

	useModernLayoutEffect(() => {
		const node = componentRef.current;

		if (node) {
			register(node, metadata);

			return () => {
				unregister(node);
			};
		}

		return undefined;
	}, [register, unregister, metadata]);

	useModernLayoutEffect(() => {
		return subscribeMapChange(map => {
			const index = componentRef.current ? map.get(componentRef.current)?.index : null;

			if (index != null) {
				setIndex(index);
			}
		});
	}, [subscribeMapChange, setIndex]);

	return React.useMemo(() => ({ ref, index }), [ref, index]);
}
