import * as React from 'react';
import { ModernComponentProps } from '@/shared/helpers/types';
import { useRenderElement } from '@/shared/hooks';
import { useToggleGroupContext } from '@/shared/ui/toggle-group';
import { CompositeItem } from '@floating-ui/react';

/**
 * Renders a `<button>` element.
 */
export const Toggle = React.forwardRef(
	(props: Toggle.Props, forwardedRef: React.ForwardedRef<HTMLButtonElement>) => {
		const { render, className, pressed, disabled, value, onChange, ...otherProps } = props;

		const groupContext = useToggleGroupContext();
		const groupValue = groupContext?.value;

		const isPressed =
			pressed ||
			(groupValue !== undefined &&
				(Array.isArray(groupValue) ? groupValue.includes(value) : groupValue === value)) ||
			false;
		const isDisabled = disabled || groupContext?.disabled || false;

		const state: Toggle.State = React.useMemo(
			() => ({ pressed: isPressed, disabled: isDisabled }),
			[isDisabled, isPressed]
		);

		const handleClick = (event: React.MouseEvent) => {
			if (onChange) {
				onChange(value, event);
			} else {
				groupContext?.onChange?.(value, event);
			}
		};

		const element = useRenderElement('button', {
			render,
			className,
			state,
			ref: forwardedRef,
			props: [
				{ 'aria-pressed': isPressed, disabled: isDisabled, onClick: handleClick },
				otherProps,
			],
		});

		if (groupContext) {
			return <CompositeItem render={element} />;
		}

		return element;
	}
);

export namespace Toggle {
	export interface State {
		pressed: boolean;
		disabled: boolean;
	}

	export interface Props
		extends Omit<ModernComponentProps<'button', State>, 'value' | 'onChange'> {
		pressed?: boolean;
		value: string;
		onChange?: (value: string, event: React.MouseEvent) => void;
	}
}
