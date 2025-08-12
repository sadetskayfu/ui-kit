import * as React from 'react';
import { activeElement } from '@floating-ui/react/utils';
import { useFieldRootContext } from '../../base/index.parts';
import { ownerDocument } from '@/shared/helpers/owner';
import { getInteractiveElement } from '@/shared/helpers/get-interactive-element';
import { ModernComponentProps } from '@/shared/helpers/types';
import { useRenderElement } from '@/shared/hooks';

/**
 * Renders a `<div>` element.
 */
export const Field = React.forwardRef(
	(props: Field.Props, forwardedRef: React.ForwardedRef<HTMLDivElement>) => {
		const { render, className,  ...otherProps } = props;
		const { controlElementRef, disabled } = useFieldRootContext();

		const onClick = (event: React.MouseEvent<HTMLDivElement>) => {
            if (disabled) {
                return
            }

            const interactiveElement = getInteractiveElement(event.nativeEvent)

            if (!interactiveElement && activeElement(ownerDocument(controlElementRef.current)) !== controlElementRef.current) {
                controlElementRef.current?.focus();
            }
		};

		const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
            if (disabled) {
                return
            }

            const interactiveElement = getInteractiveElement(event.nativeEvent)

			if (!interactiveElement) {
				event.preventDefault();
			}
		};

        const element = useRenderElement('div', {
            className,
            render,
            ref: forwardedRef,
            props: [{ onClick, onPointerDown }, otherProps]
        })

        return element
	}
);

export namespace Field {
    export interface State {}
	export interface Props extends ModernComponentProps<'div', State> {}
}
