import * as React from 'react';
import { ModernComponentProps } from '@/shared/helpers/types';
import { useRenderElement } from '@/shared/hooks';
import { ChipRootContext } from './chip-root-context';

/**
 * Renders a `<button>` element.
 */
export const ChipRoot = React.forwardRef(
	(props: ChipRoot.Props, forwardedRef: React.ForwardedRef<HTMLButtonElement>) => {
		const {
			render,
			className,
			disabled = false,
			nativeButton = true,
			onClose,
			tabIndex,
			...otherProps
		} = props;

		const contextValue: ChipRootContext = React.useMemo(
			() => ({ disabled, onClose }),
			[disabled, onClose]
		);

		const state: ChipRoot.State = React.useMemo(() => ({disabled}), [disabled])

		const element = useRenderElement('button', {
			render,
			className,
			state,
			ref: forwardedRef,
			props: [
				{
					onKeyDown: event => {
						if (onClose && !disabled && event.key === 'Backspace') {
							event.preventDefault();
							event.stopPropagation();

							onClose(event.nativeEvent);
						}
					},
					...(nativeButton && { disabled }),
					...(!nativeButton && { 'aria-disabled': disabled ? 'true' : undefined }),
					tabIndex: nativeButton ? tabIndex : disabled ? -1 : tabIndex,
				},
				otherProps,
			],
		});

		return <ChipRootContext.Provider value={contextValue}>{element}</ChipRootContext.Provider>;
	}
);

export namespace ChipRoot {
	export interface State {
		disabled: boolean
	}
	export interface Props extends ModernComponentProps<'button', State> {
		disabled?: boolean;
		/**
		 * true - prop: disabled,
		 * false - prop: aria-disabled
		 *
		 * @default true
		 */
		nativeButton?: boolean;
		onClose?: (event: Event) => void;
	}
}
