import * as React from 'react';
import { classNames } from '@/shared/helpers/class-names';
import { BaseScrollArea } from '../../base';
import { ScrollAreaRootContext } from './scroll-area-root-context';
import styles from './scroll-area-root.module.scss';

export const ScrollAreaRoot = React.forwardRef(
	(props: ScrollAreaRoot.Props, forwardedRef: React.ForwardedRef<HTMLDivElement>) => {
		const { className, children, orientation = 'vertical', ...otherProps } = props;

		const contextValue: ScrollAreaRootContext = React.useMemo(
			() => ({ orientation }),
			[orientation]
		);

		return (
			<BaseScrollArea.Root
				ref={forwardedRef}
				className={classNames(styles['scroll-area'], [className])}
				{...otherProps}
			>
				<ScrollAreaRootContext.Provider value={contextValue}>
					{children}
				</ScrollAreaRootContext.Provider>
			</BaseScrollArea.Root>
		);
	}
);

export namespace ScrollAreaRoot {
	export interface Props extends Omit<BaseScrollArea.Root.Props, 'className' | 'render'> {
		className?: string;
		/**
		 * Передайте ориентацию, чтобы у <ScrollArea.Scrollbar> и <ScrollArea.Content> были нужные отступы.
		 *
		 * @default 'vertical'
		 */
		orientation?: 'horizontal' | 'vertical' | 'both';
	}
}
