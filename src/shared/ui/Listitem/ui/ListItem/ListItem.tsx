import { forwardRef, HTMLAttributes, memo } from 'react'
import { BaseListItemProps } from '../../types/BaseListItemProps'
import { classNames } from '@/shared/helpers/classNames'
import styles from './style.module.scss'

type HTMLProps = Omit<HTMLAttributes<HTMLLIElement>, keyof BaseListItemProps>

interface ListItemProps extends BaseListItemProps {
	htmlProps?: HTMLProps
}

export const ListItem = memo(
	forwardRef((props: ListItemProps, ref: React.ForwardedRef<HTMLLIElement>) => {
		const {
			className,
			children,
			role = 'listitem',
			style,
			htmlProps,
			...otherProps
		} = props

		return (
			<li
				className={classNames(styles['item'], [className])}
				role={role}
				ref={ref}
				style={{ ...style }}
				{...htmlProps}
				{...otherProps}
			>
				{children}
			</li>
		)
	})
)
