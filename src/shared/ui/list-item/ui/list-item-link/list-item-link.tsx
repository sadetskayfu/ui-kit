import { forwardRef, memo, type AnchorHTMLAttributes, type ReactElement } from 'react';
import { Ripple } from '@/shared/lib/ripple/ui/ripple';
import { useRipple } from '@/shared/lib/ripple';
import { useClassName, type UseClassNameProps } from '../../hooks/use-class-name';

interface ListItemLinkProps
	extends Omit<UseClassNameProps, 'pressed'>,
		AnchorHTMLAttributes<HTMLAnchorElement> {
	disableRipple?: boolean;
	renderLink?: (
		props: AnchorHTMLAttributes<HTMLAnchorElement>
	) => ReactElement<AnchorHTMLAttributes<HTMLAnchorElement>>;
}

export const ListItemLink = memo(
	forwardRef((props: ListItemLinkProps, ref: React.ForwardedRef<HTMLAnchorElement>) => {
		const {
			className: externalClassName,
			active,
			disabled: isDisabled,
			disableRipple = false,
			borderRadius,

			children,
			renderLink,
			onMouseUp,
			onMouseDown,
			onMouseLeave,
			onBlur,
			...otherProps
		} = props;

		const { containerRef, ripples, removeRipple, ...handlers } = useRipple({
			disableRipple,
			onBlur,
			onMouseDown,
			onMouseUp,
			onMouseLeave,
		});

		const { className } = useClassName({
			className: externalClassName,
			active,
			disabled: isDisabled,
			borderRadius,
		});

		const sharedProps: AnchorHTMLAttributes<HTMLAnchorElement> = {
			className,
			'aria-disabled': isDisabled ? 'true' : undefined,
			onBlur: handlers.onBlur,
			onMouseDown: handlers.onMouseDown,
			onMouseLeave: handlers.onMouseLeave,
			onMouseUp: handlers.onMouseUp,
		};

		if (renderLink) {
			return renderLink({
				...sharedProps,
				...otherProps,
				children: (
					<>
						{children}
						{!disableRipple && (
							<Ripple
								ref={containerRef}
								ripples={ripples}
								removeRipple={removeRipple}
							/>
						)}
					</>
				),
			});
		}

		return (
			<a ref={ref} {...sharedProps} {...otherProps}>
				{children}
				{!disableRipple && (
					<Ripple ref={containerRef} ripples={ripples} removeRipple={removeRipple} />
				)}
			</a>
		);
	})
);
