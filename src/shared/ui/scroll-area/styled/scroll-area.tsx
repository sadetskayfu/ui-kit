import React from 'react';
import { BaseScrollArea } from '../base';
import { classNames, type Mods } from '@/shared/helpers/class-names';
import { useDirection } from '@/app/providers/direction-provider';
import styles from './scroll-area.module.scss';

interface ScrollAreaProps extends BaseScrollArea.Root.Props {
	className?: string;
	contentClassName?: string;
	orientation?: 'vertical' | 'horizontal' | 'both';
	contentPadding?: 'm' | 'l';
	border?: boolean;
	width?: number | string;
	maxWidth?: number | string;
	height?: number | string;
	maxHeight?: number | string;
	alwaysVisibleScrollbar?: boolean;
	tabIndex?: number;
}

export const ScrollArea = React.forwardRef(
	(props: ScrollAreaProps, forwardedRef: React.ForwardedRef<HTMLDivElement>) => {
		const {
			children,
			className,
			contentClassName,
			orientation = 'vertical',
			contentPadding = 'm',
			border,
			width,
			maxWidth,
			height,
			maxHeight,
			alwaysVisibleScrollbar,
			tabIndex,
			style,
			...otherProps
		} = props;

		const direction = useDirection();

		const getScrollbarClassName = React.useCallback(
			(state: BaseScrollArea.Scrollbar.State) => {
				const mods: Mods = {
					[styles['hovering']]: state.hovering,
					[styles['scrolling']]: state.scrolling,
					[styles['always-visible-scrollbar']]: alwaysVisibleScrollbar,
				};

				return classNames(
					styles['scrollbar'],
					[styles[`orientation-${state.orientation}`]],
					mods
				);
			},
			[alwaysVisibleScrollbar]
		);

		const scrollAreaClassName = classNames(
			styles['scroll-area'],
			[
				className,
				styles[`content-padding-${contentPadding}`],
				styles[`orientation-${orientation}`],
				styles[`direction-${direction}`],
			],
			{ [styles['border']]: border }
		);

		const isVisibleScrollbarY = orientation === 'vertical' || orientation === 'both';
		const isVisibleScrollbarX = orientation === 'horizontal' || orientation === 'both';

		return (
			<BaseScrollArea.Root
				className={scrollAreaClassName}
				ref={forwardedRef}
				style={{ height, maxHeight, width, maxWidth, ...style }}
				{...otherProps}
			>
				<BaseScrollArea.Viewport
					className={styles['viewport']}
					style={{
						maxHeight: maxHeight != null ? 'inherit' : undefined,
						maxWidth: maxWidth != null ? 'inherit' : undefined,
					}}
					{...(tabIndex != null && { tabIndex })}
				>
					<BaseScrollArea.Content
						className={classNames(styles['content'], [contentClassName])}
					>
						{children}
					</BaseScrollArea.Content>
				</BaseScrollArea.Viewport>
				{isVisibleScrollbarY && (
					<BaseScrollArea.Scrollbar
						className={getScrollbarClassName}
						orientation="vertical"
					>
						<BaseScrollArea.Thumb className={styles['thumb']} />
					</BaseScrollArea.Scrollbar>
				)}
				{isVisibleScrollbarX && (
					<BaseScrollArea.Scrollbar
						className={getScrollbarClassName}
						orientation="horizontal"
					>
						<BaseScrollArea.Thumb className={styles['thumb']} />
					</BaseScrollArea.Scrollbar>
				)}
				{orientation === 'both' && <BaseScrollArea.Corner />}
			</BaseScrollArea.Root>
		);
	}
);
