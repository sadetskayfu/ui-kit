import * as React from 'react';
import { ModernComponentProps } from '@/shared/helpers/types';
import { useId, useModernLayoutEffect, useRenderElement } from '@/shared/hooks';
import { useToastRootContext } from '../root/toast-root-context';

/**
 * Renders a `<button>` element.
 */
export const TostTitle = React.forwardRef(
	(props: TostTitle.Props, forwardedRef: React.ForwardedRef<HTMLHeadingElement>) => {
		const { render, className, id: idProp, children: childrenProp, ...otherProps } = props;

		const { toast, setTitleId } = useToastRootContext();

		const id = useId(idProp);

		const children = childrenProp ?? toast.title;

		const shouldRender = Boolean(children);

		useModernLayoutEffect(() => {
			if (!shouldRender) {
				return;
			}

			setTitleId(id);

			return () => {
				setTitleId(undefined);
			};
		}, [shouldRender, id, setTitleId]);

		const element = useRenderElement('h2', {
			render,
			className,
			ref: forwardedRef,
			props: [{ id, children }, otherProps],
		});

		if (!shouldRender) {
			return null;
		}

		return element;
	}
);

export namespace TostTitle {
	export interface State {}
	export interface Props extends ModernComponentProps<'h2', State> {}
}
