import * as React from 'react';
import { FloatingOverlay } from '@floating-ui/react';
import { PopoverPopup } from '../popup/popover-popup';
import { usePopoverRootContext } from '../root/popover-root-context';
import { resolveClassName } from '@/shared/helpers/resolve-class-name';
import { HTMLProps } from '@/shared/helpers/types';

/**
 * Renders a `<div>` element.
 */
export const PopoverBackdrop = React.forwardRef(
	(props: PopoverBackdrop.Props, forwardedRef: React.ForwardedRef<HTMLDivElement>) => {
		const { render, className: classNameProp, children, ...otherProps } = props;

		const { status, mounted } = usePopoverRootContext();

		const state: PopoverBackdrop.State = React.useMemo(() => ({ status }), [status]);

		if (!mounted) {
			return null;
		}

		const className = resolveClassName(classNameProp, state)

		if (render) {
			return render({ ref: forwardedRef, className, children, ...otherProps }, state)
		}

		return (
			<FloatingOverlay
				ref={forwardedRef}
				className={className}
				{...otherProps}
			>
				{children}
			</FloatingOverlay>
		);
	}
);

export namespace PopoverBackdrop {
	export interface State extends PopoverPopup.State {}
	export interface Props extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className'> {
		className?: string | ((state: State) => string | undefined);
		render?: (props: HTMLProps, state: State) => React.ReactElement
	}
}
