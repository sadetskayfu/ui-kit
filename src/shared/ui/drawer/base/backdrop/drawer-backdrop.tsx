import * as React from 'react';
import { FloatingOverlay } from '@floating-ui/react';
import { useDrawerRootContext } from '../root/drawer-root-context';
import { resolveClassName } from '@/shared/helpers/resolve-class-name';
import { HTMLProps } from '@/shared/helpers/types';

/**
 * Renders a `<div>` element.
 */
export const DrawerBackdrop = React.forwardRef(
	(props: DrawerBackdrop.Props, forwardedRef: React.ForwardedRef<HTMLDivElement>) => {
		const { render, className: classNameProp, children, ...otherProps } = props;

		const { status, mounted } = useDrawerRootContext();

		const state: DrawerBackdrop.State = React.useMemo(() => ({ status }), [status]);

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

export namespace DrawerBackdrop {
	export interface State {
		status: 'open' | 'close' | undefined
	}
	export interface Props extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className'> {
		className?: string | ((state: State) => string | undefined);
		render?: (props: HTMLProps, state: State) => React.ReactElement
	}
}
