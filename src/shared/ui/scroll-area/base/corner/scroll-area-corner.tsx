import React from 'react';
import type { ModernComponentProps } from '@/shared/helpers/types';
import { useScrollAreaRootContext } from '../root/scroll-area-root-context';
import { useRenderElement } from '@/shared/hooks';
import styles from './scroll-area-corner.module.scss'

export const ScrollAreaCorner = React.forwardRef(
	(props: ScrollAreaCorner.Props, forwardedRef: React.ForwardedRef<HTMLDivElement>) => {
		const { className, ...otherProps } = props;

		const { cornerRef, hiddenState } = useScrollAreaRootContext();

		const element = useRenderElement('div', {
			className,
            ref: [forwardedRef, cornerRef],
			props: [
				{
					className: styles['base-corner'],
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
	export interface Props extends ModernComponentProps<'div'> {}
}
