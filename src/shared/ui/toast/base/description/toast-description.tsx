import * as React from 'react';
import { ModernComponentProps } from '@/shared/helpers/types';
import { useId, useModernLayoutEffect, useRenderElement } from '@/shared/hooks';
import { useToastRootContext } from '../root/toast-root-context';

/**
 * Renders a `<p>` element.
 */
export const TostDescription = React.forwardRef(
	(props: TostDescription.Props, forwardedRef: React.ForwardedRef<HTMLParagraphElement>) => {
		const { render, className, id: idProp, children: childrenProp, ...otherProps } = props;

		const { toast, setDescriptionId } = useToastRootContext();

		const id = useId(idProp);

		const children = childrenProp ?? toast.description;

		const shouldRender = Boolean(children);

		useModernLayoutEffect(() => {
			if (!shouldRender) {
				return;
			}

			setDescriptionId(id);

			return () => {
				setDescriptionId(undefined);
			};
		}, [shouldRender, id, setDescriptionId]);

		const element = useRenderElement('p', {
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

export namespace TostDescription {
	export interface State {}
	export interface Props extends ModernComponentProps<'p', State> {}
}
