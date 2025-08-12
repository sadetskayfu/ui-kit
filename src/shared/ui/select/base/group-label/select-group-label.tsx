import * as React from 'react';
import { ModernComponentProps } from '@/shared/helpers/types';
import { useId, useModernLayoutEffect, useRenderElement } from '@/shared/hooks';
import { useSelectGroupContext } from '../group/select-group-context';

/**
 * Renders a `<div>` element.
 */
export const SelectGroupLabel = React.forwardRef(
	(props: SelectGroupLabel.Props, forwardedRef: React.ForwardedRef<HTMLDivElement>) => {
		const { render, className, id: idProp, ...otherProps } = props;

		const id = useId(idProp);

		const { setLabelId } = useSelectGroupContext();

		useModernLayoutEffect(() => {
			setLabelId(id);

			return () => {
				setLabelId(undefined);
			};
		}, [id, setLabelId]);

		const element = useRenderElement('div', {
			render,
			className,
			ref: forwardedRef,
			props: [{ id }, otherProps],
		});

		return element;
	}
);

export namespace SelectGroupLabel {
	export interface State {}
	export interface Props extends ModernComponentProps<'div', State> {}
}
