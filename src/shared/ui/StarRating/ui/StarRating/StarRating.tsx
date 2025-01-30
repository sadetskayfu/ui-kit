import { classNames } from '@/shared/helpers/classNames'
import { Star, StarSize } from '../Star/Star'
import {
	HTMLAttributes,
	memo,
	useCallback,
	useEffect,
	useId,
	useState,
} from 'react'
import { useAnimation } from '@/shared/hooks/useAnimation'
import { Typography } from '@/shared/ui/Typography'
import styles from './style.module.scss'

interface BaseStarRatingProps {
	className?: string
	size?: StarSize
	selectedValue: number
	fillValue?: number
	name: string
	label: string
	maxStars?: number
	tabIndex?: number
	disabled?: boolean
	readOnly?: boolean
	required?: boolean
	isPrecise?: boolean
	isHiddenLegend?: boolean
	errorMessage?: string
	helperText?: string
	onChange: (value: number) => void
	onChangeFillValue?: (value: number) => void
}

type HTMLFieldsetProps = Omit<
	HTMLAttributes<HTMLFieldSetElement>,
	keyof BaseStarRatingProps
>

interface StarRatingProps extends BaseStarRatingProps {
	fieldsetProps?: HTMLFieldsetProps
}

export const StarRating = memo((props: StarRatingProps) => {
	const {
		className,
		size = 'medium',
		selectedValue,
		fillValue: externalFillValue,
		name,
		label,
		maxStars = 5,
		tabIndex = 0,
		disabled,
		readOnly,
		isPrecise,
		isHiddenLegend = true,
		required,
		errorMessage,
		helperText,
		onChange,
		onChangeFillValue,
		fieldsetProps,
	} = props

	const [fillValue, setFillValue] = useState<number>(selectedValue)
	const { isAnimating, startAnimation } = useAnimation(1000)

	const localFillValue =
		typeof externalFillValue === 'number' ? externalFillValue : fillValue

	const errorMessageId = useId()

	const handleChangeValue = useCallback(
		(value: number) => {
			onChange(value)
		},
		[onChange]
	)

	const handleChangeFillValue = useCallback(
		(value: number) => {
			if (onChangeFillValue) {
				onChangeFillValue(value)
			} else {
				setFillValue(value)
			}
		},
		[onChangeFillValue]
	)

	useEffect(() => {
		if (localFillValue !== selectedValue) {
			handleChangeFillValue(selectedValue)
		}
	// eslint-disable-next-line
	}, [selectedValue])

	const mods: Record<string, boolean | undefined> = {
		[styles['hidden-legend']]: isHiddenLegend,
		[styles['success']]: isAnimating,
		[styles['required']]: required,
		[styles['errored']]: !!errorMessage,
	}

	const renderStars = () => {
		return [...Array(maxStars)].map((_, index) => {
			const starValue = index + 1
			const isFullFilled = starValue <= localFillValue
			const isThreeQuartersFilled =
				!isFullFilled && starValue - 0.25 <= localFillValue
			const isHalfFilled =
				!isFullFilled && !isThreeQuartersFilled && starValue - 0.5 <= localFillValue
			const isQuarterFilled =
				!isFullFilled &&
				!isThreeQuartersFilled &&
				!isHalfFilled &&
				starValue - 0.75 <= localFillValue

			const fillProps = {
				isFullFilled,
				isThreeQuartersFilled,
				isHalfFilled,
				isQuarterFilled,
			}

			const starMods: Record<string, boolean | undefined> = {
				[styles['success']]: isAnimating && (isFullFilled || isHalfFilled),
			}

			return (
				<Star
					key={starValue}
					className={classNames(styles['star'], [], starMods)}
					name={name}
					value={starValue}
					selectedValue={selectedValue}
					onChange={handleChangeValue}
					onChangeFillValue={handleChangeFillValue}
					isPrecise={isPrecise}
					disabled={disabled}
					readOnly={readOnly}
					tabIndex={tabIndex}
					size={size}
					{...fillProps}
				/>
			)
		})
	}

	return (
		<fieldset
			className={classNames(styles['star-rating'], [className], mods)}
			aria-disabled={disabled && 'true'}
			aria-readonly={readOnly && 'true'}
			aria-required={required ? 'true' : 'false'}
			aria-errormessage={errorMessage && errorMessageId}
			{...fieldsetProps}
		>
			<legend className={styles['legend']}>{label}</legend>
			<div
				role="radiogroup"
				className={styles['stars-group']}
				onMouseLeave={() => handleChangeFillValue(selectedValue)}
				onMouseUp={readOnly || disabled ? undefined : startAnimation}
			>
				{renderStars()}
			</div>
			{errorMessage && (
				<Typography id={errorMessageId} color="error" variant="helper-text">
					{errorMessage}
				</Typography>
			)}
			{helperText && !errorMessage && (
				<Typography variant="helper-text">{helperText}</Typography>
			)}
		</fieldset>
	)
})
