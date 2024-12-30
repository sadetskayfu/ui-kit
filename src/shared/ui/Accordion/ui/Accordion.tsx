import { classNames } from '@/shared/lib/classNames/classNames'
import { ReactNode, useId, useState } from 'react'
import { Collapse } from '@/shared/ui/Collapse'
import { Icon } from '@/shared/ui/Icon'
import styles from './style.module.scss'

type AccordionVariant = 'filled' | 'outlined'
type AccordionTitleVariant = 'h3' | 'h4'

export interface AccordionProps {
	className?: string
	children: ReactNode
	title: string
	titleVariant?: AccordionTitleVariant
	variant?: AccordionVariant
	disabled?: boolean
	tabIndex?: number
	isOpen?: boolean
	onChange?: () => void
}

export const Accordion = (props: AccordionProps) => {
	const {
		className,
		children,
		title,
		titleVariant = 'h4',
		variant = 'filled',
		disabled,
		tabIndex = 0,
		isOpen: isOpenInGroup,
		onChange
	} = props

	const [isOpen, setIsOpen] = useState<boolean>(false)

	const bodyId = useId()
	const headerId = useId()

	const handleToggle = () => {
		if(disabled) return

		if(onChange) {
			onChange()
		} else {
			setIsOpen((prev) => !prev)
		}
	}

	const handleKeyUp = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault()
			handleToggle()
		}
	}

	const mods: Record<string, boolean | undefined> = {
		[styles['open']]: isOpen || isOpenInGroup,
		[styles['disabled']]: disabled,
	}

	const additionalClasses: Array<string | undefined> = [
		className,
		styles[variant],
	]
	
	return (
		<div className={classNames(styles['accordion'], additionalClasses, mods)}>
			<div
				className={styles['header']}
				tabIndex={disabled ? -1 : tabIndex}
				onClick={handleToggle}
				onKeyUp={handleKeyUp}
				role="button"
				aria-expanded={isOpen || isOpenInGroup ? 'true' : 'false'}
				aria-controls={bodyId}
				aria-disabled={disabled ? 'true' : undefined}
				id={headerId}
			>
				{titleVariant === 'h3' && <h3 className={styles['title']}>{title}</h3>}
				{titleVariant === 'h4' && <h4 className={styles['title']}>{title}</h4>}
				<div className={styles['header-icon']}>
					<Icon className={styles['open-icon']} variant="plus" />
					<Icon className={styles['close-icon']} variant="minus" />
				</div>
			</div>
			<Collapse isOpen={isOpenInGroup || isOpen} headerId={headerId} bodyId={bodyId}>
				<div className={styles['body']}>{children}
				</div>
			</Collapse>
		</div>
	)
}
