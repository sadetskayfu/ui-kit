import { Field, FieldSize, FieldVariant } from '@/shared/ui/Field'
import {
	InputHTMLAttributes,
	memo,
	ReactElement,
	TextareaHTMLAttributes,
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
	onChange?: (
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => void
	onClear?: () => void
	onBlur?: () => void
	onFocus?: () => void
	label: string
	labelId?: string
	variant?: FieldVariant
	size?: FieldSize
	errorMessage?: string
	helperText?: string
	Actions?: ReactElement[]
	StartAdornment?: ReactElement | string | number
	disabled?: boolean
	readOnly?: boolean
	required?: boolean
    hiddenLabel?: boolean
	multiline?: boolean
}

type HTMLInputProps = Omit<
	InputHTMLAttributes<HTMLInputElement>,
	keyof BaseTextFieldProps
>

type HTMLTextAreaProps = Omit<
	TextareaHTMLAttributes<HTMLTextAreaElement>,
	keyof BaseTextFieldProps
>

interface TextFieldProps extends BaseTextFieldProps {
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
		variant = 'filled',
		size = 'large',
		errorMessage,
		helperText,
		Actions: ExternalActions = [],
		StartAdornment,
		disabled,
		readOnly,
		required,
		multiline,
        hiddenLabel,
		inputProps,
		textAreaProps,
	} = props

	const [isFocused, setIsFocused] = useState<boolean>(false)

	const isDirty = value !== ''

	const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null)

	const localLabelId = useId()
	const errorMessageId = useId()
	const labelId = externalLabelId ? externalLabelId : localLabelId

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
		if (!multiline) return

		const textarea = inputRef.current

		if (textarea) {
			textarea.style.height = 'auto'

			const newHeight = textarea.scrollHeight

			textarea.style.height = `${newHeight}px`
		}
	}, [value, multiline])

	const mods: Record<string, boolean | undefined> = {
		[styles['dirty']]: isDirty,
		[styles['focused']]: isFocused,
	}

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
		onChange,
		onFocus: handleFocus,
		onBlur: handleBlur,
		onMouseDown: (event: React.MouseEvent) => event.stopPropagation(),
		'aria-labelledby': labelId,
		'aria-errormessage': errorMessage ? errorMessageId : undefined,
		disabled,
		readOnly: readOnly,
		required,
	}

	return (
		<div className={className}>
			<Field
				className={classNames(styles['field'], [], mods)}
				label={label}
				labelId={labelId}
				variant={variant}
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
                hiddenLabel={hiddenLabel}
			>
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
			</Field>
		</div>
	)
})
