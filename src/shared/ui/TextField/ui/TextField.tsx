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
	TextareaHTMLAttributes,
	useCallback,
	useEffect,
	useId,
	useRef,
	useState,
} from 'react'
import { classNames } from '@/shared/lib/classNames/classNames'
import { IconButton } from '@/shared/ui/IconButton'
import { XMark } from '@/shared/assets/icons'
import styles from './style.module.scss'

interface BaseTextFieldProps {
	className?: string
	value?: string
	onChange?: (value: string, name: string) => void
	onClear?: () => void
	onBlur?: () => void
	onFocus?: () => void
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
	readOnly?: boolean
	required?: boolean
	defaultWidth?: boolean
	multiline?: boolean
	tabIndex?: number
	children?: ReactNode
	fieldRef?: React.Ref<HTMLDivElement>
	fieldProps?: HTMLFieldProps
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
		value,
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
		readOnly,
		required,
		defaultWidth,
		multiline,
		tabIndex = 0,
		children,
		fieldRef,
		fieldProps,
		inputProps,
		textAreaProps,
	} = props

	const [isFocused, setIsFocused] = useState<boolean>(false)

	const isDirty = value !== ''

	const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null)

	const localLabelId = useId()
	const errorMessageId = useId()
	const labelId = externalLabelId ? externalLabelId : localLabelId

	const handleChange = useCallback(
		(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			onChange?.(event.target.value, event.target.name)
		},
		[onChange]
	)

	const handleFocus = useCallback(() => {
		setIsFocused(true)
		onFocus?.()
	}, [onFocus])

	const handleBlur = useCallback(() => {
		setIsFocused(false)
		onBlur?.()
	}, [onBlur])

	// Update height textarea
	useEffect(() => {
		if (!multiline) return

		const textarea = inputRef.current

		if (textarea) {
			textarea.style.height = 'auto'

			const newHeight = textarea.scrollHeight

			textarea.style.height = `${newHeight / 16}rem`
		}
	}, [value, multiline])

	const Actions = onClear
		? [
				<IconButton
					className={styles['clear-button']}
					onClick={!readOnly ? onClear : undefined}
					size="small-xx"
					variant="clear"
					color="grey"
					tabIndex={-1}
				>
					<XMark />
				</IconButton>,
				...ExternalActions,
			]
		: ExternalActions

	const sharedProps = {
		value,
		placeholder,
		onChange: handleChange,
		onFocus: handleFocus,
		onBlur: handleBlur,
		onMouseDown: (event: React.MouseEvent) => event.stopPropagation(),
		'aria-labelledby': labelId,
		'aria-errormessage': errorMessage ? errorMessageId : undefined,
		disabled,
		readOnly,
		required,
		tabIndex: disabled ? -1 : tabIndex,
	}

	const mods: Record<string, boolean | undefined> = {
		[styles['dirty']]: isDirty,
		[styles['focused']]: isFocused,
	}

	return (
		<div className={classNames(styles['text-field'], [className], {[styles['default-width']]: defaultWidth})}>
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
					...fieldProps
				}}
			>
				<div className={styles['content']}>
					{children && children}
					{multiline ? (
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
