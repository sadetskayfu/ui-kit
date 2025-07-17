import { forwardRef, memo, type ButtonHTMLAttributes } from 'react';
import { Ripple } from '@/shared/lib/ripple/ui/ripple';
import { useRipple } from '@/shared/lib/ripple';
import { useClassName, type UseClassNameProps } from '../../hooks/use-class-name';

interface ListItemButtonProps extends UseClassNameProps, ButtonHTMLAttributes<HTMLButtonElement> {
	disableRipple?: boolean
}

export const ListItemButton = memo(
	forwardRef((props: ListItemButtonProps, ref: React.ForwardedRef<HTMLButtonElement>) => {
		const {
			className: externalClassName,
			active,
			pressed: isPressed,
			disabled: isDisabled,
			disableRipple = false,
			borderRadius,

			children,
			onKeyDown,
			onKeyUp,
			onMouseUp,
			onMouseDown,
			onMouseLeave,
			onBlur,
			...otherProps
		} = props;

		const { containerRef, ripples, removeRipple, ...handlers } = useRipple({
			onBlur,
			onKeyDown,
			onKeyUp,
			onMouseDown,
			onMouseUp,
			onMouseLeave,
		});

		const { className } = useClassName({
			className: externalClassName,
			active,
			disabled: isDisabled,
			pressed: isPressed,
			borderRadius,
		})

		return (
			<button
				className={className}
				ref={ref}
				disabled={isDisabled}
				{...otherProps}
				{...handlers}
			>
				{children}
				{!disableRipple && (
					<Ripple ref={containerRef} ripples={ripples} removeRipple={removeRipple} />
				)}
			</button>
		);
	})
);
