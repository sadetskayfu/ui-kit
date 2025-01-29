import {
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
import { useChangeValue } from '../hooks/useChangeValue'
import { OptionItem } from '@/shared/ui/OptionItem'
import { classNames } from '@/shared/helpers/classNames'
import { TextFieldProps } from '@/shared/ui/TextField'
import { filterByIncludes } from '@/shared/helpers/filters'
import {
	useFocusOption,
	useNavigation,
	useOptions,
} from '@/shared/hooks/formOptions'
import { isValueSelected } from '@/shared/helpers/checkingValues'
import styles from './style.module.scss'

export type Option = {
	value: string
	label: string
}

type OptionProps = {
	id: string
	isSelected: boolean
	disabled: boolean
}

interface SelectProps {
	className?: string
	options: Option[]
	value: string
	selectedValue: string | string[]
	isOpen?: boolean
	isLoading?: boolean
	disabled?: boolean
	readonly?: boolean
	required?: boolean
	defaultWidth?: boolean
	noFilter?: boolean
	menuHeight?: string
	menuWidth?: string
	menuPosition?: DropdownPortalPosition
	onChange: (value: string) => void
	onSelect: (value: string | string[]) => void
	onOpen?: () => void
	onClose?: () => void
	renderOption?: (option: Option, props: OptionProps) => ReactElement
	renderInput: (
		params: Partial<TextFieldProps>,
		actions: ReactElement[]
	) => ReactElement<TextFieldProps>
	renderTags?: (
		value: string,
		label: string,
		params: { onClose?: () => void }
	) => ReactElement
	filterOptions?: (optionValue: string, searchValue: string) => boolean
	getDisabledOptions?: (value: string) => boolean
	onBlur?: () => void
	onFocus?: () => void
}

export const Autocomplete = (props: SelectProps) => {
	const {
		className,
		options,
		value,
		selectedValue,
		isOpen: externalIsOpen,
		isLoading,
		disabled,
		readonly,
		required,
		defaultWidth,
		noFilter,
		menuHeight = '300px',
		menuWidth = '100%',
		menuPosition = 'bottom',
		onChange,
		onSelect,
		onOpen,
		onClose,
		renderOption,
		renderInput,
		renderTags,
		filterOptions,
		getDisabledOptions,
		onBlur,
		onFocus,
	} = props

	const [isOpen, setIsOpen] = useState<boolean>(
		typeof externalIsOpen === 'boolean' ? externalIsOpen : false
	)
	const [isMountedMenu, setIsMountedMenu] = useState<boolean>(false)
	const [isFilterOptions, setIsFilterOptions] = useState<boolean>(false)

	const fieldRef = useRef<HTMLDivElement>(null)
	const optionsListRef = useRef<HTMLUListElement>(null)
	const selectedValueRef = useRef<string | string[]>(selectedValue)
	const valueRef = useRef<string>(value)
	const isOpenRef = useRef<boolean>(false)
	const isMountedMenuRef = useRef<boolean>(false)
	const isFilterOptionsRef = useRef<boolean>(false)
	const isMulti = Array.isArray(selectedValue)
	const focusedClassName = styles['focused']

	const labelId = useId()
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

	// Update ref value
	useEffect(() => {
		valueRef.current = value
	}, [value])

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

	// Update ref isFilterOptions
	useEffect(() => {
		isFilterOptionsRef.current = isFilterOptions
	}, [isFilterOptions])

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
		if (isOpenRef.current) {
			handleClose()
		} else {
			handleOpen()
		}
	}, [handleClose, handleOpen])

	const handleStopFiler = useCallback(() => {
		setIsFilterOptions(false)
	}, [])

	const {
		handleClick,
		handleDeleteValue,
		handleSelectValue,
		selectedOptionsRef,
	} = useChangeValue({
		onSelect,
		onClose: handleClose,
		onChange,
		onStopFilter: handleStopFiler,
		setFocusedOption,
		isFilterOptionsRef,
		value,
		valueRef,
		activeIndexRef,
		selectedValueRef,
		options: localOptions,
		optionsRef,
		focusedClassName,
	})

	const { handleKeyDown, handleMouseMove } = useNavigation({
		optionsRef,
		optionsListRef,
		isOpen,
		isOpenRef,
		activeIndexRef,
		setFocusedOption,
		onClose: handleClose,
		onOpen: handleOpen,
		onToggle: handleToggle,
		onSelect: handleSelectValue,
		onDelete: handleDeleteValue,
		valueRef,
		selectedValueRef,
	})

	const handleFocus = useCallback(() => {
		onFocus?.()
	}, [onFocus])

	const handleBlur = useCallback(() => {
		if (isMulti) {
			onChange('')
		} else {
			const selectedValue = selectedValueRef.current as string

			onChange(selectedValue.length > 0 ? selectedOptionsRef.current[selectedValue] : '')
		}
		handleStopFiler()

		handleClose()
		onBlur?.()
	}, [onBlur, handleClose, handleStopFiler, isMulti, onChange, selectedOptionsRef])

	const handleChange = useCallback(
		(value: string) => {
			if (!isOpenRef.current) {
				handleOpen()
			}
			if (!noFilter) {
				setIsFilterOptions(true)
			}

			setFocusedOption(-1)
			onChange(value)
		},
		[onChange, setFocusedOption, noFilter, handleOpen]
	)

	// Reset filter after close menu if value === selected value
	useEffect(() => {
		if (
			!noFilter &&
			!isOpen &&
			!isMulti &&
			value === localOptions[selectedValue]?.label &&
			isFilterOptions
		) {
			handleStopFiler()
		}
	}, [isOpen])

	useEffect(() => {
		if (typeof externalIsOpen === 'boolean' && externalIsOpen !== isOpen) {
			setIsOpen(externalIsOpen)
		}
	}, [externalIsOpen])

	const renderOptions = useMemo(() => {
		if (options.length === 0) {
			return isLoading ? (
				<OptionItem role='progressbar' readOnly label="Loading..." />
			) : (
				<OptionItem readOnly label="No options" />
			)
		}

		return options.map((option, index) => {
			const optionValue = option.value
			
			const optionProps: OptionProps = {
				id: optionId + (index + 1),
				disabled: getDisabledOptions ? getDisabledOptions(optionValue) : false,
				isSelected: isValueSelected(optionValue, selectedValue),
			}

			return renderOption ? (
				renderOption(option, optionProps)
			) : (
				<OptionItem
					key={optionValue}
					value={optionValue}
					label={option.label}
					{...optionProps}
				/>
			)
		})
	}, [selectedValue, getDisabledOptions, renderOption, optionId, options, isLoading])

	const renderFilteredOptions = useMemo(() => {
		if (
			!noFilter &&
			isFilterOptions &&
			value !== '' &&
			Array.isArray(renderOptions)
		) {
			const filteredOptions = renderOptions.filter((option) => {
				
				const optionLabel = localOptions[option.props.value].label

				return filterOptions
					? filterOptions(optionLabel, value)
					: filterByIncludes(optionLabel, value)
			})

			if (filteredOptions.length === 0) {
				return <OptionItem readOnly label="No options" />
			}

			return filteredOptions
		}
		return renderOptions
	}, [value, isFilterOptions, renderOptions, noFilter, filterOptions, localOptions])

	const renderSelectedValues = useMemo(() => {
		if (isMulti) {
			if (selectedValue.length > 0) {
				const selectedOptions = selectedOptionsRef.current

				if (renderTags) {
					return selectedValue.map((optionValue) => {
						return renderTags(optionValue, selectedOptions[optionValue], {
							onClose: () => (readonly ? undefined : handleDeleteValue(optionValue)),
						})
					})
				} else {
					const optionsLabel = selectedValue.map(
						(optionValue) => selectedOptions[optionValue]
					)
					return <p>{optionsLabel.join(', ')}</p>
				}
			}
		}
	}, [selectedValue, isMulti, handleDeleteValue, renderTags, readonly, selectedOptionsRef])

	const mods: Record<string, boolean | undefined> = {
		[styles['opened']]: isOpen,
		[styles['multi']]: isMulti,
		[styles['default-width']]: defaultWidth,
	}

	return (
		<>
			<div className={classNames(styles['autocomplete'], [className], mods)}>
				{renderInput(
					{
						className: styles['field'],
						value,
						onChange: handleChange,
						onBlur: handleBlur,
						onFocus: handleFocus,
						labelId,
						readonly,
						disabled,
						required,
						contentPadding: isMulti ? true : false,
						fieldRef,
						fieldProps: {
							onClick: readonly ? undefined : handleToggle,
						},
						inputProps: {
							onKeyDown: readonly ? undefined : handleKeyDown,
							role: 'combobox',
							'aria-haspopup': 'listbox',
							'aria-expanded': isOpen,
							'aria-controls': isMountedMenu ? optionsListId : undefined,
							'aria-activedescendant': isOpen ? focusedOptionId : undefined,
						},
						children: isMulti && (
							<div aria-hidden="true" className={styles['selected-values']}>
								{renderSelectedValues}
							</div>
						),
					},
					[
						<span className={styles['arrow-icon']}>
							<Arrow size="small-xx" />
						</span>,
					]
				)}
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
						aria-multiselectable={isMulti ? 'true' : 'false'}
					>
						{renderFilteredOptions}
					</ul>
				</DropdownPortal>
			)}
		</>
	)
}
