import { memo, useMemo, type ReactElement } from 'react';
import { classNames } from '@/shared/helpers/class-names';
import styles from './list-item-content.module.scss';

type StopPropagationHandlers = {
	onMouseDown: React.MouseEventHandler;
	onKeyUp: React.KeyboardEventHandler;
	onKeyDown: React.KeyboardEventHandler;
	onClick: React.MouseEventHandler;
	onBlur: React.FocusEventHandler;
};

export type ListItemRenderActionsProps = {
	className: string;
	handlers: StopPropagationHandlers;
};

export interface ListItemContentProps {
	children?: React.ReactNode;
	className?: string;
	title?: string;
	description?: string;
	startAdornment?: ReactElement;
	renderActions?: (props: ListItemRenderActionsProps) => ReactElement;
}

export const ListItemContent = memo((props: ListItemContentProps) => {
	const { children, className, title, description, startAdornment, renderActions } = props;

	const renderedActions = useMemo(() => {
		return renderActions
			? renderActions({
					className: styles['actions'],
					handlers: {
						onClick: event => event.stopPropagation(),
						onMouseDown: event => event.stopPropagation(),
						onKeyDown: event => event.stopPropagation(),
						onKeyUp: event => event.stopPropagation(),
						onBlur: event => event.stopPropagation(),
					},
				})
			: null;
	}, [renderActions]);

	return (
		<div className={classNames(styles['list-item-content'], [className])}>
			{startAdornment && startAdornment}
			{children ? (
				children
			) : (
				<div className={styles['title-wrapper']}>
					<span className={styles['title']}>{title}</span>
					{description && <span className={styles['description']}>{description}</span>}
				</div>
			)}
			{renderedActions}
		</div>
	);
});
