import {
	ButtonHTMLAttributes,
	forwardRef,
	memo,
	ReactElement,
	Suspense,
	useRef,
} from 'react'
import { classNames } from '@/shared/helpers/classNames'
import { RippleWrapper } from '@/shared/ui/RippleWrapper'
import { handleRipple, handleRippleCursorPosition } from '@/shared/lib/ripple'
import { IndicatorPosition, IndicatorLazy } from '@/shared/ui/Indicator'
import styles from './style.module.scss'

interface AriaAttributes {
	'aria-label'?: string
}

type TabSize = 'medium' | 'large'
type TabIconPosition = 'left' | 'top' | 'right' | 'bottom'
export type TabVariant = 'filled' | 'clear'

interface BaseTabProps extends AriaAttributes {
	className?: string
	id: string
	panelId: string
	value: string
	isSelected?: boolean
	label?: string
	disabled?: boolean
	Icon?: ReactElement
	size?: TabSize
	variant?: TabVariant
	iconPosition?: TabIconPosition
	tabIndex?: number
	isIndicator?: boolean
	indicatorPosition?: IndicatorPosition
	onClick?: (value: string) => void
	onFocus?: () => void
}

type HTMLButtonProps = Omit<
	ButtonHTMLAttributes<HTMLButtonElement>,
	keyof BaseTabProps
>

export interface TabProps extends BaseTabProps {
	buttonProps?: HTMLButtonProps
}

export const Tab = memo(
	forwardRef((props: TabProps, ref: React.ForwardedRef<HTMLButtonElement>) => {
		const {
			className,
			id,
			panelId,
			value,
			isSelected,
			label,
			onClick,
			onFocus,
			disabled,
			tabIndex = -1,
			Icon,
			size = 'medium',
			iconPosition = 'left',
			variant = 'filled',
			indicatorPosition = 'bottom',
			isIndicator,
			buttonProps,
			...otherProps
		} = props

		const rippleWrapperRef = useRef<HTMLSpanElement>(null)

		const handleClick = (event: React.MouseEvent) => {
			if (!isSelected) {
				onClick!(value)

				if (event.clientX) {
					handleRippleCursorPosition(rippleWrapperRef, event)
				} else {
					handleRipple(rippleWrapperRef)
				}
			}
		}

		const additionalClasses: Array<string | undefined> = [
			className,
			styles[size],
			styles[iconPosition],
			styles[variant],
		]

		const mods: Record<string, boolean | undefined> = {
			[styles['selected']]: isSelected,
		}

		const localTabIndex = isSelected && !disabled ? 0 : disabled ? -1 : tabIndex

		return (
			<button
				className={classNames(styles['tab'], additionalClasses, mods)}
				ref={ref}
				id={id}
				tabIndex={localTabIndex}
				disabled={disabled}
				onClick={handleClick}
				onFocus={onFocus}
				data-disabled={disabled ? 'true' : undefined}
				data-value={value}
				type="button"
				role="tab"
				aria-selected={isSelected ? 'true' : 'false'}
				aria-controls={panelId}
				{...buttonProps}
				{...otherProps}
			>
				{Icon && <span className={styles['icon']}>{Icon}</span>}
				{label && label}
				<RippleWrapper ref={rippleWrapperRef} />
				{isIndicator && (
					<Suspense>
						<IndicatorLazy isActive={isSelected} position={indicatorPosition}/>
					</Suspense>
				)}
			</button>
		)
	})
)
