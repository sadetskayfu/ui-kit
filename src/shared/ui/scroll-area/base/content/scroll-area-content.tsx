import React from 'react';
import type { ModernComponentProps } from '@/shared/helpers/types';
import { useModernLayoutEffect, useRenderElement } from '@/shared/hooks';
import { useScrollAreaRootContext } from '../root/scroll-area-root-context';
import styles from './scroll-area-content.module.scss'

export const ScrollAreaContent = React.forwardRef(
	(props: ScrollAreaContent.Props, forwardedRef: React.ForwardedRef<HTMLDivElement>) => {
		const { className, ...otherProps } = props;

		const contentRef = React.useRef<HTMLDivElement>(null);

		const { computeThumbPosition } = useScrollAreaRootContext();

		useModernLayoutEffect(() => {
			if (typeof ResizeObserver === 'undefined') {
				return undefined;
			}

			const ro = new ResizeObserver(computeThumbPosition);

			if (contentRef.current) {
				ro.observe(contentRef.current);
			}

			return () => {
				ro.disconnect();
			};
		}, [computeThumbPosition]);

		const element = useRenderElement('div', {
			className,
			ref: [forwardedRef, contentRef],
			props: [
				{
					className: styles['base-content'],
                    role: 'presentation',
				},
				otherProps,
			],
		});

		return element;
	}
);

export namespace ScrollAreaContent {
	export interface Props extends ModernComponentProps<'div'> {}
}
