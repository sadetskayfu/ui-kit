import * as React from 'react';
import type { ModernComponentProps } from '@/shared/helpers/types';
import { useScrollAreaRootContext } from '../root/scroll-area-root-context';
import { useRenderElement } from '@/shared/hooks';
import { classNames } from '@/shared/helpers/class-names';
import { useDirection } from '@/app/providers/direction-provider';
import styles from './scroll-area-corner.module.scss'

/**
 * Renders a `<div>` element.
 */
export const ScrollAreaCorner = React.forwardRef(
	(props: ScrollAreaCorner.Props, forwardedRef: React.ForwardedRef<HTMLDivElement>) => {
		const { render, className, ...otherProps } = props;

		const { cornerRef, hiddenState } = useScrollAreaRootContext();
		const direction = useDirection()

		const element = useRenderElement('div', {
			render,
			className,
            ref: [forwardedRef, cornerRef],
			props: [
				{
					className: classNames(styles['base-corner'], [styles[`direction-${direction}`]]),
				},
				otherProps,
			],
		});

        if (hiddenState.cornerHidden) {
            return null
        }

        return element
	}
);

export namespace ScrollAreaCorner {
	export interface State {}
	export interface Props extends ModernComponentProps<'div', State> {}
}
