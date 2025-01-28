import { classNames } from '@/shared/helpers/classNames'
import { ReactNode, useId, useState } from 'react'
import { Collapse } from '@/shared/ui/Collapse'
import { Minus, Plus } from '@/shared/assets/icons'
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
	isLazy?: boolean
	isUnmount?: boolean
	tabIndex?: number
	isOpen?: boolean
	onToggle?: () => void
}

export const Accordion = (props: AccordionProps) => {
	const {
		className,
		children,
		title,
		titleVariant = 'h4',
		variant = 'filled',
		disabled,
		isLazy,
		isUnmount,
		tabIndex = 0,
		isOpen: externalIsOpen,
		onToggle,
	} = props

	const [isOpen, setIsOpen] = useState<boolean>(false)

	const localIsOpen =
		typeof externalIsOpen === 'boolean' ? externalIsOpen : isOpen

	const bodyId = useId()
	const headerId = useId()

	const handleToggle = () => {
		if (disabled) return

		if (onToggle) {
			onToggle()
		} else {
			setIsOpen((prev) => !prev)
		}
	}

	const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (event.key === 'Enter') {
			event.preventDefault()
			handleToggle()
		}
	}

	const handleKeyUp = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if(event.key === ' ') {
			event.preventDefault()
			handleToggle()
		}
	}

	const mods: Record<string, boolean | undefined> = {
		[styles['open']]: localIsOpen,
		[styles['disabled']]: disabled,
	}

	const additionalClasses: Array<string | undefined> = [
		className,
		styles[variant],
	]

	const TitleTag = titleVariant

	return (
		<div className={classNames(styles['accordion'], additionalClasses, mods)}>
			<div
				className={styles['header']}
				id={headerId}
				tabIndex={disabled ? -1 : tabIndex}
				onClick={handleToggle}
				onKeyDown={handleKeyDown}
				onKeyUp={handleKeyUp}
				role="button"
				aria-expanded={localIsOpen ? 'true' : 'false'}
				aria-controls={bodyId}
				aria-disabled={disabled ? 'true' : undefined}
			>
				<TitleTag className={styles['title']}>{title}</TitleTag>
				<div className={styles['header-icon']}>
					<Plus className={styles['open-icon']} />
					<Minus className={styles['close-icon']} />
				</div>
			</div>
			<Collapse isOpen={localIsOpen} headerId={headerId} bodyId={bodyId} isLazy={isLazy} isUnmount={isUnmount}>
				<div className={styles['body']}>{children}</div>
			</Collapse>
		</div>
	)
}
