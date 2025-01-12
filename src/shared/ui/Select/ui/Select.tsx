import { Field, FieldSize, FieldVariant } from '@/shared/ui/Field'
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
import { useKeyboardNavigation } from '../model/useKeyboardNavigation'
import { useOptions } from '../model/useOptions'
import { OptionItemProps } from '@/shared/ui/OptionItem'
import { checkValue } from '../model/checkValue'
import { useChangeValue } from '../model/useChangeValue'
import { Chip } from '@/shared/ui/Chip'
import { classNames } from '@/shared/lib/classNames/classNames'
import styles from './style.module.scss'

export type Option = {
	value: string
	label: string
}

interface SelectProps {
	className?: string
	children: ReactElement<OptionItemProps>[]
	options: Option[]
	selectedValue: string | string[]
	onChange: (value: string | string[]) => void
	label: string
	placeholder?: string
	variant?: FieldVariant
	size?: FieldSize
	StartAdornment?: ReactElement | string | number
	chips?: boolean
	errorMessage?: string
	helperText?: string
	hiddenLabel?: boolean
	disabled?: boolean
	readOnly?: boolean
	required?: boolean
	tabIndex?: number
	menuHeight?: string
	menuWidth?: string
	menuPosition?: DropdownPortalPosition
	getDisabledOptions?: (value: string) => boolean
	onBlur?: () => void
	onFocus?: () => void
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
		variant,
		size,
		StartAdornment,
		chips,
		errorMessage,
		helperText,
		hiddenLabel,
		disabled,
		readOnly,
		required,
		tabIndex = 0,
		menuHeight = '300px',
		menuWidth = '100%',
		menuPosition = 'bottom',
		getDisabledOptions,
		onBlur,
		onFocus,
		...otherProps
	} = props

	const [isOpen, setIsOpen] = useState<boolean>(false)
	const [isMountedMenu, setIsMountedMenu] = useState<boolean>(false)
	const [isFocused, setIsFocused] = useState<boolean>(false)

	const selectRef = useRef<HTMLDivElement | null>(null)
	const fieldRef = useRef<HTMLDivElement | null>(null)
	const optionsListRef = useRef<HTMLUListElement | null>(null)
	const optionsRef = useOptions(optionsListRef, isMountedMenu)
	const selectedValueRef = useRef<string | string[]>(selectedValue)
	const isOpenRef = useRef<boolean>(false)
	const isMountedMenuRef = useRef<boolean>(false)

	const labelId = useId()
	const errorMessageId = useId()
	const optionsListId = useId()
	const optionId = useId()

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

	const { handleClick, handleDeleteValue, handleSelectValue } = useChangeValue({
		onChange,
		selectedValueRef,
	})

	const handleClose = useCallback(() => {
		setIsOpen(false)
	}, [])

	const handleOpen = useCallback(() => {
		if (!isMountedMenuRef.current) {
			setIsMountedMenu(true)
		}
		setIsOpen(true)
	}, [])

	const handleToggle = useCallback(() => {
		if (!isMountedMenuRef.current) {
			setIsMountedMenu(true)
		}
		setIsOpen((prev) => !prev)
	}, [])

	const handleFocus = useCallback(() => {
		setIsFocused(true)
		onFocus?.()
	}, [onFocus])

	const handleBlur = useCallback(() => {
		setIsFocused(false)
		onBlur?.()
	}, [onBlur])

	const { handleKeyDown, throttleHandleChangeIndex, focusedOptionId } =
		useKeyboardNavigation({
			focusedClassName: styles['focused'],
			optionsRef,
			optionsListRef,
			isOpen,
			isOpenRef,
			onClose: handleClose,
			onOpen: handleOpen,
			onToggle: handleToggle,
			onSelect: handleSelectValue,
			onDelete: handleDeleteValue,
			selectedValueRef,
		})

	const localOptions = useMemo(() => {
		return options.reduce(
			(keys, option) => {
				keys[option.value] = option
				return keys
			},
			{} as Record<string, Option>
		)
	}, [options])

	const renderOptions = useMemo(() => {
		let index = 0

		return Children.map(children, (child) => {
			const optionValue = child.props.value

			if (!optionValue) {
				return cloneElement(child)
			}

			const optionIndex = index
			const isDisabled = getDisabledOptions
				? getDisabledOptions(optionValue)
				: false
			const isSelected = checkValue(optionValue, selectedValue)

			index++

			return cloneElement(child, {
				id: optionId + optionValue,
				index: optionIndex,
				setIndex: throttleHandleChangeIndex,
				selected: isSelected,
				disabled: isDisabled,
			})
		})
	}, [throttleHandleChangeIndex, selectedValue, getDisabledOptions, children])

	const renderSelectedValue = useMemo(() => {
		if (selectedValue.length > 0) {
			if (Array.isArray(selectedValue)) {
				if (chips) {
					return selectedValue.map((optionValue) => {
						return (
							<Chip
								key={optionValue}
								onClose={() => (readOnly ? undefined : handleDeleteValue(optionValue))}
								color="secondary"
								variant="filled"
								size="medium"
								label={localOptions[optionValue].label}
								tabIndex={-1}
							/>
						)
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
	}, [selectedValue, readOnly])

	const mods: Record<string, boolean | undefined> = {
		[styles['opened']]: isOpen,
		[styles['disabled']]: disabled,
	}

	return (
		<>
			<div
				className={classNames(styles['select'], [className], mods)}
				tabIndex={disabled ? -1 : tabIndex}
				ref={selectRef}
				onFocus={handleFocus}
				onBlur={handleBlur}
				onClick={readOnly ? undefined : handleToggle}
				onKeyDown={readOnly ? undefined : handleKeyDown}
				role="combobox"
				aria-haspopup="listbox"
				aria-expanded={isOpen}
				aria-errormessage={errorMessage ? errorMessageId : undefined}
				aria-labelledby={labelId}
				aria-controls={isMountedMenu ? optionsListId : undefined}
				aria-activedescendant={isOpen ? focusedOptionId : undefined}
				aria-readonly={readOnly ? 'true' : undefined}
				aria-required={required ? 'true' : 'false'}
				aria-disabled={disabled ? 'true' : undefined}
				{...otherProps}
			>
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
					size={size}
					errored={!!errorMessage}
					focused={isFocused}
					helperText={helperText}
					errorMessage={errorMessage}
					errorMessageId={errorMessageId}
					focusElementRef={selectRef}
					disabled={disabled}
					required={required}
					hiddenLabel={hiddenLabel}
					ref={fieldRef}
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
						id={optionsListId}
						onClick={handleClick}
						ref={optionsListRef}
						aria-labelledby={labelId}
						role="listbox"
						aria-multiselectable={Array.isArray(selectedValue) ? 'true' : 'false'}
						style={{ maxHeight: menuHeight }}
					>
						{renderOptions}
					</ul>
				</DropdownPortal>
			)}
		</>
	)
}
