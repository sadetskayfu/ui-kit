import { forwardRef, memo, useCallback, type HTMLAttributes } from 'react';
import { Ripple } from '@/shared/lib/ripple/ui/ripple';
import { useRipple } from '@/shared/lib/ripple';
import { useClassName, type UseClassNameProps } from '../../hooks/use-class-name';

interface ListItemProps extends UseClassNameProps, HTMLAttributes<HTMLDivElement> {
	disableRipple?: boolean
}

export const ListItem = memo(
	forwardRef((props: ListItemProps, ref: React.ForwardedRef<HTMLDivElement>) => {
		const {
			className: externalClassName,
			active,
			pressed: isPressed,
			disabled: isDisabled,
			disableRipple = false,
			borderRadius,

			children,
			tabIndex = 0,
			role = 'button',
			onKeyDown,
			onKeyUp,
			onMouseUp,
			onMouseDown,
			onMouseLeave,
			onBlur,
			onClick,
			...otherProps
		} = props;

		const handleKeyDown = useCallback(
			(event: React.KeyboardEvent<HTMLDivElement>) => {
				if (event.key === 'Enter') {
					const clickEvent = new MouseEvent('click', {
						bubbles: true,
						cancelable: true,
						view: window,
					});

					onClick?.(clickEvent as any);
				}
				onKeyDown?.(event);
			},
			[onKeyDown, onClick]
		);

		const handleKeyUp = useCallback(
			(event: React.KeyboardEvent<HTMLDivElement>) => {
				if (event.key === ' ') {
					event.preventDefault();

					const clickEvent = new MouseEvent('click', {
						bubbles: true,
						cancelable: true,
						view: window,
					});

					onClick?.(clickEvent as any);
				}
				onKeyUp?.(event);
			},
			[onKeyUp, onClick]
		);

		const { containerRef, ripples, removeRipple, ...handlers } = useRipple({
			disableRipple,
			onBlur,
			onKeyDown: handleKeyDown,
			onKeyUp: handleKeyUp,
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
			<div
				className={className}
				ref={ref}
				role={role}
				aria-disabled={isDisabled ? 'true' : undefined}
				inert={isDisabled ? true : undefined}
				onClick={onClick}
				tabIndex={isDisabled ? -1 : tabIndex}
				{...otherProps}
				{...handlers}
			>
				{children}
				{!disableRipple && (
					<Ripple ref={containerRef} ripples={ripples} removeRipple={removeRipple} />
				)}
			</div>
		);
	})
);
