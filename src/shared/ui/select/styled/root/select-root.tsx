import * as React from 'react';
import { BaseSelect } from '../../base';
import { SelectRootContext } from './select-root-context';
import { applyStyles } from '@/shared/helpers/apply-styles';

export const SelectRoot = (props: SelectRoot.Props) => {
	const { children, availableHeight = false, ...otherProps } = props;

	const scrollAreaRootRef = React.useRef<HTMLDivElement>(null);

	const contextValue: SelectRootContext = React.useMemo(() => ({ scrollAreaRootRef }), []);

	const setAvailableHeight = React.useCallback((height: number) => {
		applyStyles(scrollAreaRootRef.current, {
			maxHeight: `${height - 5 * 2 - 16 }px`, // Отнимаем отступ контейнера(16px) и вертикальные паддинги(5px) всплывающего окна от доступной высоты.
		});
	}, []);

	return (
		<BaseSelect.Root
			setAvailableHeight={availableHeight ? setAvailableHeight : undefined}
			{...otherProps}
		>
			<SelectRootContext value={contextValue}>{children}</SelectRootContext>
		</BaseSelect.Root>
	);
};

export namespace SelectRoot {
	export interface Props extends Omit<BaseSelect.Root.Props, 'setAvailableHeight'> {
		/**
		 * @default false
		 */
		availableHeight?: boolean;
	}
}
