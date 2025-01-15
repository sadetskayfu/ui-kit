import { classNames } from '@/shared/lib/classNames/classNames'
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
		isOpen: externalIsOpen,
		onChange
	} = props

	const [isOpen, setIsOpen] = useState<boolean>(false)

	const localIsOpen = typeof externalIsOpen === 'boolean' ? externalIsOpen : isOpen

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

	const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (event.key === 'Enter' || event.key === ' ') {
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
				tabIndex={disabled ? -1 : tabIndex}
				onClick={handleToggle}
				onKeyDown={handleKeyDown}
				role="button"
				aria-expanded={localIsOpen ? 'true' : 'false'}
				aria-controls={bodyId}
				aria-disabled={disabled ? 'true' : undefined}
				id={headerId}
			>
				<TitleTag className={styles['title']}>{title}</TitleTag>
				<div className={styles['header-icon']}>
					<Plus className={styles['open-icon']}/>
					<Minus className={styles['close-icon']}/>
				</div>
			</div>
			<Collapse isOpen={localIsOpen} headerId={headerId} bodyId={bodyId}>
				<div className={styles['body']}>{children}
				</div>
			</Collapse>
		</div>
	)
}
