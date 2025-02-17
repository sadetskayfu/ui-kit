import {
	Field,
	FieldLabelVariant,
	FieldSize,
	FieldVariant,
	HTMLFieldProps,
} from '@/shared/ui/Field'
import {
	ChangeEvent,
	InputHTMLAttributes,
	memo,
	ReactElement,
	ReactNode,
	Suspense,
	TextareaHTMLAttributes,
	useCallback,
	useEffect,
	useId,
	useRef,
	useState,
} from 'react'
import { classNames } from '@/shared/helpers/classNames/classNames'
import { IconButtonLazy } from '@/shared/ui/IconButton'
import { XMark } from '@/shared/assets/icons'
import styles from './style.module.scss'

interface BaseTextFieldProps {
	className?: string
	value?: string | number
	label: string
	labelId?: string
	placeholder?: string
	variant?: FieldVariant
	labelVariant?: FieldLabelVariant
	size?: FieldSize
	errorMessage?: string
	helperText?: string
	Actions?: (ReactElement | undefined)[]
	StartAdornment?: ReactElement | string | number
	disabled?: boolean
	readonly?: boolean
	required?: boolean
	debounceDelay?: number
	defaultWidth?: boolean
	contentPadding?: boolean
	isMultiline?: boolean
	tabIndex?: number
	children?: ReactNode
	fieldRef?: React.Ref<HTMLDivElement>
	fieldProps?: HTMLFieldProps
	onChange?: (value: string, name: string) => void
	onClear?: () => void
	onBlur?: () => void
	onFocus?: () => void
}

type HTMLInputProps = Omit<
	InputHTMLAttributes<HTMLInputElement>,
	keyof BaseTextFieldProps
>

type HTMLTextAreaProps = Omit<
	TextareaHTMLAttributes<HTMLTextAreaElement>,
	keyof BaseTextFieldProps
>

export interface TextFieldProps extends BaseTextFieldProps {
	inputProps?: HTMLInputProps
	textAreaProps?: HTMLTextAreaProps
}

export const TextField = memo((props: TextFieldProps) => {
	const {
		className,
		value: externalValue,
		onChange,
		onClear,
		onBlur,
		onFocus,
		label,
		labelId: externalLabelId,
		placeholder,
		variant = 'outlined',
		labelVariant = 'on-border',
		size = 'medium',
		errorMessage,
		helperText,
		Actions: ExternalActions = [],
		StartAdornment,
		disabled,
		readonly,
		required,
		debounceDelay,
		defaultWidth,
		contentPadding,
		isMultiline,
		tabIndex = 0,
		children,
		fieldRef,
		fieldProps,
		inputProps,
		textAreaProps,
	} = props

	const [localValue, setLocalValue] = useState<string | number | undefined>(externalValue)
	const debounceTimeoutIdRef = useRef<NodeJS.Timeout | null>(null)

	const [isFocused, setIsFocused] = useState<boolean>(false)

	const isDirty = localValue !== ''

	const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)

	const localLabelId = useId()
	const errorMessageId = useId()
	const labelId = externalLabelId ? externalLabelId : localLabelId

	const handleChange = useCallback((
		event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		if(onChange) {
			const newValue = event.target.value

			setLocalValue(newValue)
	
			if(typeof debounceDelay === 'number' && debounceDelay > 0) {
				if(debounceTimeoutIdRef.current) {
					clearTimeout(debounceTimeoutIdRef.current)
				}
				debounceTimeoutIdRef.current = setTimeout(() => {
					onChange(newValue, event.target.name)
				}, debounceDelay)
			} else {
				onChange(newValue, event.target.name)
			}
		}
	}, [onChange, debounceDelay])

	const handleFocus = () => {
		setIsFocused(true)
		onFocus?.()
	}

	const handleBlur = () => {
		setIsFocused(false)
		onBlur?.()
	}

	// Update height textarea
	useEffect(() => {
		if (!isMultiline) return

		const textarea = inputRef.current

		if (textarea) {
			textarea.style.height = 'auto'

			const newHeight = textarea.scrollHeight

			textarea.style.height = `${newHeight / 16}rem`
		}
	}, [localValue, isMultiline])

	useEffect(() => {
		if(externalValue !== localValue) {
			
			setLocalValue(externalValue)
		}
	// eslint-disable-next-line
	}, [externalValue])

	useEffect(() => {
		return () => {
			if (debounceTimeoutIdRef.current) {
				clearTimeout(debounceTimeoutIdRef.current)
			}
		}
	}, [])

	const Actions = onClear
		? [
				<Suspense>
					<IconButtonLazy
						className={styles['clear-button']}
						onClick={!readonly ? onClear : undefined}
						size="small-xx"
						variant="clear"
						color="secondary"
						tabIndex={-1}
						stopFocus
					>
						<XMark />
					</IconButtonLazy>
				</Suspense>,
				...ExternalActions,
			]
		: ExternalActions

	const sharedProps = {
		value: localValue,
		placeholder,
		disabled,
		readOnly: readonly,
		required,
		tabIndex: disabled ? -1 : tabIndex,
		onChange: handleChange,
		onFocus: handleFocus,
		onBlur: handleBlur,
		onMouseDown: (event: React.MouseEvent) => event.stopPropagation(),
		'aria-labelledby': labelId,
		'aria-errormessage': errorMessage ? errorMessageId : undefined,
	}

	const mods: Record<string, boolean | undefined> = {
		[styles['dirty']]: isDirty,
		[styles['focused']]: isFocused,
	}

	const fieldContainerMods: Record<string, boolean | undefined> = {
		[styles['content-padding']]: contentPadding,
		[styles['default-width']]: defaultWidth,
	}

	const additionalClasses: Array<string | undefined> = [
		className,
		styles[size],
		styles[variant],
	]

	return (
		<div
			className={classNames(
				styles['text-field'],
				additionalClasses,
				fieldContainerMods
			)}
		>
			<Field
				className={classNames(styles['field'], [], mods)}
				label={label}
				labelId={labelId}
				variant={variant}
				labelVariant={labelVariant}
				size={size}
				errored={!!errorMessage}
				focused={isFocused}
				StartAdornment={StartAdornment}
				Actions={Actions}
				helperText={helperText}
				errorMessage={errorMessage}
				errorMessageId={errorMessageId}
				focusElementRef={inputRef}
				disabled={disabled}
				required={required}
				ref={fieldRef}
				htmlProps={{
					onMouseDown: (event) => event.preventDefault(),
					...fieldProps,
				}}
			>
				<div className={styles['content']}>
					{children && children}
					{isMultiline ? (
						<textarea
							className={styles['text-area']}
							rows={1}
							ref={inputRef as React.MutableRefObject<HTMLTextAreaElement>}
							{...textAreaProps}
							{...sharedProps}
						/>
					) : (
						<input
							className={styles['input']}
							ref={inputRef as React.MutableRefObject<HTMLInputElement>}
							{...inputProps}
							{...sharedProps}
						/>
					)}
				</div>
			</Field>
		</div>
	)
})
