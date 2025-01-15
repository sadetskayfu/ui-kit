import {
	Field,
	FieldLabelVariant,
	FieldSize,
	FieldVariant,
	HTMLFieldProps,
} from '@/shared/ui/Field'
import {
	Children,
	cloneElement,
	ReactElement,
	useCallback,
	useEffect,
	useId,
	useMemo,
	useRef,
	useState,
} from 'react'
import { Arrow } from '@/shared/assets/icons'
import {
	DropdownPortal,
	DropdownPortalPosition,
} from '@/shared/ui/DropdownPortal'
import { OptionItemProps } from '@/shared/ui/OptionItem'
import { useChangeValue } from '../model/useChangeValue'
import { classNames } from '@/shared/lib/classNames/classNames'
import {
	useFocusOption,
	useNavigation,
	useOptions,
} from '@/shared/hooks/formOptions'
import { checkValue } from '@/shared/lib/formOptions'
import styles from './style.module.scss'

export type Option = {
	value: string
	label: string
}

interface SelectProps {
	className?: string
	children: ReactElement[]
	options: Option[]
	selectedValue: string | string[]
	onChange: (value: string | string[]) => void
	label: string
	placeholder?: string
	variant?: FieldVariant
	labelVariant?: FieldLabelVariant
	size?: FieldSize
	StartAdornment?: ReactElement | string | number
	errorMessage?: string
	helperText?: string
	disabled?: boolean
	readonly?: boolean
	required?: boolean
	defaultWidth?: boolean
	tabIndex?: number
	menuHeight?: string
	menuWidth?: string
	menuPosition?: DropdownPortalPosition
	isOpen?: boolean
	onOpen?: () => void
	onClose?: () => void
	renderTags?: (
		value: string,
		label: string,
		params: { onClose: () => void }
	) => ReactElement
	getDisabledOptions?: (value: string) => boolean
	onBlur?: () => void
	onFocus?: () => void
	fieldProps?: HTMLFieldProps
}



export const Select = (props: SelectProps) => {
	const {
		className,
		children,
		options,
		selectedValue,
		onChange,
		label,
		placeholder,
		variant = 'outlined',
		labelVariant = 'on-border',
		size = 'large',
		StartAdornment,
		errorMessage,
		helperText,
		disabled,
		readonly,
		required,
		defaultWidth,
		tabIndex = 0,
		menuHeight = '300px',
		menuWidth = '100%',
		menuPosition = 'bottom',
		isOpen: externalIsOpen,
		onClose,
		onOpen,
		renderTags,
		getDisabledOptions,
		onBlur,
		onFocus,
		fieldProps
	} = props

	const [isOpen, setIsOpen] = useState<boolean>(typeof externalIsOpen === 'boolean' ? externalIsOpen : false)
	const [isMountedMenu, setIsMountedMenu] = useState<boolean>(false)
	const [isFocused, setIsFocused] = useState<boolean>(false)

	const fieldRef = useRef<HTMLDivElement | null>(null)
	const optionsListRef = useRef<HTMLUListElement | null>(null)
	const selectedValueRef = useRef<string | string[]>(selectedValue)
	const isOpenRef = useRef<boolean>(false)
	const isMountedMenuRef = useRef<boolean>(false)
	const isMulti = Array.isArray(selectedValue)
	const focusedClassName = styles['focused']

	const labelId = useId()
	const errorMessageId = useId()
	const optionsListId = useId()
	const optionId = useId()

	const localOptions = useMemo(() => {
		return options.reduce(
			(keys, option) => {
				keys[option.value] = option
				return keys
			},
			{} as Record<string, Option>
		)
	}, [options])

	const optionsRef = useOptions(optionsListRef, isMountedMenu)
	const { activeIndexRef, focusedOptionId, setFocusedOption } = useFocusOption(
		optionsRef,
		focusedClassName
	)

	// Update ref selected value
	useEffect(() => {
		selectedValueRef.current = selectedValue
	}, [selectedValue])

	// Update ref isOpen
	useEffect(() => {
		isOpenRef.current = isOpen
	}, [isOpen])

	// Update ref isMounted
	useEffect(() => {
		isMountedMenuRef.current = isMountedMenu
	}, [isMountedMenu])

	const handleClose = useCallback(() => {
		setIsOpen(false)
		onClose?.()
	}, [onClose])

	const handleOpen = useCallback(() => {
		if (!isMountedMenuRef.current) {
			setIsMountedMenu(true)
		}
		setIsOpen(true)
		onOpen?.()
	}, [onOpen])

	const handleToggle = useCallback(() => {
		if(isOpenRef.current) {
			handleClose()
		} else {
			handleOpen()
		}
	}, [handleClose, handleOpen])

	const handleFocus = useCallback(() => {
		setIsFocused(true)
		onFocus?.()
	}, [onFocus])

	const handleBlur = useCallback(() => {
		setIsFocused(false)
		handleClose()
		onBlur?.()
	}, [onBlur, handleClose])

	const { handleClick, handleDeleteValue, handleSelectValue } = useChangeValue({
		selectedValueRef,
		activeIndexRef,
		focusedClassName,
		optionsRef,
		onClose: handleClose,
		onChange,
	})

	const { handleKeyDown, handleMouseMove } = useNavigation({
		optionsRef,
		optionsListRef,
		isOpen,
		isOpenRef,
		activeIndexRef,
		selectedValueRef,
		setFocusedOption,
		onClose: handleClose,
		onOpen: handleOpen,
		onToggle: handleToggle,
		onSelect: handleSelectValue,
		onDelete: handleDeleteValue,
	})

	useEffect(() => {
		if (typeof externalIsOpen === 'boolean' && externalIsOpen !== isOpen) {
			setIsOpen(externalIsOpen)
		}
	}, [externalIsOpen])

	const renderOptions = useMemo(() => {
		return Children.map(children, (child, index) => {
			const optionValue: string | undefined = child.props.value

			if (!optionValue) {
				return cloneElement(child)
			}

			const isDisabled = getDisabledOptions
				? getDisabledOptions(optionValue)
				: false
			const isSelected = checkValue(optionValue, selectedValue)

			return cloneElement(child as ReactElement<OptionItemProps>, {
				id: optionId + (index + 1),
				selected: isSelected,
				disabled: isDisabled,
			})
		})
	}, [selectedValue, getDisabledOptions, children])

	const renderSelectedValue = useMemo(() => {
		if (selectedValue.length > 0) {
			if (isMulti) {
				if (renderTags) {
					return selectedValue.map((optionValue) => {
						return renderTags(optionValue, localOptions[optionValue].label, {
							onClose: () => (readonly ? undefined : handleDeleteValue(optionValue)),
						})
					})
				} else {
					const optionsLabel = selectedValue.map(
						(optionValue) => localOptions[optionValue].label
					)
					return <p>{optionsLabel.join(', ')}</p>
				}
			} else {
				return <p>{localOptions[selectedValue].label}</p>
			}
		}
	}, [selectedValue, readonly, localOptions, isMulti, handleDeleteValue])

	const mods: Record<string, boolean | undefined> = {
		[styles['opened']]: isOpen,
		[styles['default-width']]: defaultWidth
	}

	return (
		<>
			<div className={classNames(styles['select'], [className], mods)}>
				<Field
					className={styles['field']}
					label={label}
					labelId={labelId}
					StartAdornment={StartAdornment}
					Actions={[
						<span className={styles['arrow-icon']}>
							<Arrow size="small-xx" />
						</span>,
					]}
					variant={variant}
					labelVariant={labelVariant}
					size={size}
					errored={!!errorMessage}
					focused={isFocused}
					helperText={helperText}
					errorMessage={errorMessage}
					errorMessageId={errorMessageId}
					disabled={disabled}
					required={required}
					ref={fieldRef}
					htmlProps={{
						tabIndex: disabled ? -1 : tabIndex,
						onFocus: handleFocus,
						onBlur: handleBlur,
						onClick: readonly ? undefined : handleToggle,
						onKeyDown: readonly ? undefined : handleKeyDown,
						role: 'combobox',
						'aria-haspopup': 'listbox',
						'aria-expanded': isOpen,
						'aria-errormessage': errorMessage ? errorMessageId : undefined,
						'aria-labelledby': labelId,
						'aria-controls': isMountedMenu ? optionsListId : undefined,
						'aria-activedescendant': isOpen ? focusedOptionId : undefined,
						'aria-readonly': readonly ? 'true' : undefined,
						'aria-required': required ? 'true' : 'false',
						'aria-disabled': disabled ? 'true' : undefined,
						...fieldProps
					}}
				>
					<div className={styles['content']}>
						<div aria-hidden="true" className={styles['selected-values']}>
							{selectedValue.length > 0 && renderSelectedValue}
						</div>
						{placeholder && selectedValue.length === 0 && (
							<span className={styles['placeholder']}>{placeholder}</span>
						)}
					</div>
				</Field>
			</div>
			{isMountedMenu && (
				<DropdownPortal
					isOpen={isOpen}
					onClose={handleClose}
					parentRef={fieldRef}
					width={menuWidth}
					position={menuPosition}
				>
					<ul
						className={styles['menu']}
						style={{ maxHeight: menuHeight }}
						id={optionsListId}
						onClick={handleClick}
						onMouseMove={handleMouseMove}
						ref={optionsListRef}
						aria-labelledby={labelId}
						role="listbox"
						aria-multiselectable={Array.isArray(selectedValue) ? 'true' : 'false'}
					>
						{renderOptions}
					</ul>
				</DropdownPortal>
			)}
		</>
	)
}
