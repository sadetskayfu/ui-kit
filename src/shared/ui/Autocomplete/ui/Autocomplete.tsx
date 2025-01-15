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
import { useChangeValue } from '../model/useChangeValue'
import { OptionItem } from '@/shared/ui/OptionItem'
import { classNames } from '@/shared/lib/classNames/classNames'
import { TextFieldProps } from '@/shared/ui/TextField'
import { filterByIncludes } from '@/shared/lib/filters'
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

type OptionProps = {
	id: string
	selected: boolean
	disabled: boolean
}

interface SelectProps {
	className?: string
	options: Option[]
	value: string
	selectedValue: string | string[]
	onChange: (value: string) => void
	onSelect: (value: string | string[]) => void
	isOpen?: boolean
	onOpen?: () => void
	onClose?: () => void
	isLoading?: boolean
	disabled?: boolean
	readOnly?: boolean
	required?: boolean
	defaultWidth?: boolean
	noFilter?: boolean
	menuHeight?: string
	menuWidth?: string
	menuPosition?: DropdownPortalPosition
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
		onChange,
		onSelect,
		isOpen: externalOpen,
		onOpen,
		onClose,
		isLoading,
		disabled,
		readOnly,
		required,
		defaultWidth,
		noFilter,
		menuHeight = '300px',
		menuWidth = '100%',
		menuPosition = 'bottom',
		renderOption,
		renderInput,
		renderTags,
		filterOptions,
		getDisabledOptions,
		onBlur,
		onFocus,
	} = props

	const [isOpen, setIsOpen] = useState<boolean>(
		typeof externalOpen === 'boolean' ? externalOpen : false
	)
	const [isMountedMenu, setIsMountedMenu] = useState<boolean>(false)
	const [isFilterOptions, setIsFilterOptions] = useState<boolean>(false)

	const fieldRef = useRef<HTMLDivElement | null>(null)
	const optionsListRef = useRef<HTMLUListElement | null>(null)
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
		selectedOptionLabelRef,
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

			onChange(selectedValue.length > 0 ? selectedOptionLabelRef.current : '')
		}
		handleStopFiler()

		handleClose()
		onBlur?.()
	}, [onBlur, handleClose, handleStopFiler, isMulti])

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
		[onChange, setFocusedOption, noFilter]
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
		if (typeof externalOpen === 'boolean' && externalOpen !== isOpen) {
			setIsOpen(externalOpen)
		}
	}, [externalOpen])

	const renderOptions = useMemo(() => {
		if (options.length === 0) {
			return isLoading ? (
				<OptionItem readonly label="Loading..." />
			) : (
				<OptionItem readonly label="No options" />
			)
		}

		return options.map((option, index) => {
			console.log('map options')

			const optionValue = option.value

			const optionProps: OptionProps = {
				id: optionId + (index + 1),
				disabled: getDisabledOptions ? getDisabledOptions(optionValue) : false,
				selected: checkValue(optionValue, selectedValue),
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
	}, [selectedValue, getDisabledOptions, options, isLoading])

	const renderFilteredOptions = useMemo(() => {
		if (
			!noFilter &&
			isFilterOptions &&
			value !== '' &&
			Array.isArray(renderOptions)
		) {
			const filteredOptions = renderOptions.filter((option) => {
				console.log('Filter options')

				const optionLabel = localOptions[option.props.value].label

				return filterOptions
					? filterOptions(optionLabel, value)
					: filterByIncludes(optionLabel, value)
			})

			if (filteredOptions.length === 0) {
				return <OptionItem readonly label="No options" />
			}

			return filteredOptions
		}
		return renderOptions
	}, [value, isFilterOptions, renderOptions, noFilter, filterOptions])

	const renderSelectedValues = useMemo(() => {
		if (isMulti) {
			if (selectedValue.length > 0) {
				if (renderTags) {
					return selectedValue.map((optionValue) => {
						return renderTags(optionValue, localOptions[optionValue].label, {
							onClose: () => (readOnly ? undefined : handleDeleteValue(optionValue)),
						})
					})
				} else {
					const optionsLabel = selectedValue.map(
						(optionValue) => localOptions[optionValue].label
					)
					return <p>{optionsLabel.join(', ')}</p>
				}
			}
		}
	}, [selectedValue, isMulti, localOptions, handleDeleteValue, readOnly])

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
						readOnly,
						disabled,
						required,
						fieldRef,
						fieldProps: {
							onClick: readOnly ? undefined : handleToggle,
						},
						inputProps: {
							onKeyDown: readOnly ? undefined : handleKeyDown,
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
