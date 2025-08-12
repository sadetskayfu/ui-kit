import * as React from 'react';
import { FloatingOverlay } from '@floating-ui/react';
import { resolveClassName } from '@/shared/helpers/resolve-class-name';
import { HTMLProps } from '@/shared/helpers/types';
import { useSelectRootContext } from '../root/select-root-context';
import { useStore } from '@/shared/lib/store';
import { selectors } from '../store';

/**
 * Renders a `<div>` element.
 */
export const SelectBackdrop = React.forwardRef(
	(props: SelectBackdrop.Props, forwardedRef: React.ForwardedRef<HTMLDivElement>) => {
		const { render, className: classNameProp, children, ...otherProps } = props;

		const {store} = useSelectRootContext()

        const mounted = useStore(store, selectors.mounted)
        const status = useStore(store, selectors.status)

		const state: SelectBackdrop.State = React.useMemo(() => ({ status }), [status]);

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

export namespace SelectBackdrop {
	export interface State {
        status: 'open' | 'close' | undefined
    }
	export interface Props extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className'> {
		className?: string | ((state: State) => string | undefined);
		render?: (props: HTMLProps, state: State) => React.ReactElement
	}
}
