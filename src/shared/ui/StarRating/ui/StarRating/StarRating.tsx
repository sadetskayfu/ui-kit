import { classNames } from '@/shared/lib/classNames/classNames'
import { Star, StarSize } from '../Star/Star'
import { HTMLAttributes, memo, useCallback, useEffect, useId, useState } from 'react'
import { useAnimation } from '@/shared/hooks/useAnimation'
import { Typography } from '@/shared/ui/Typography'
import styles from './style.module.scss'

interface BaseStarRatingProps {
	className?: string
	size?: StarSize
	selectedValue: number
	onChange: (value: number) => void
	name: string
	label: string
	maxStars?: number
	tabIndex?: number
	disabled?: boolean
	readonly?: boolean
	required?: boolean
	precise?: boolean
	hiddenLegend?: boolean
	errorMessage?: string
	helperText?: string
}

type HTMLFieldsetProps = Omit<HTMLAttributes<HTMLFieldSetElement>, keyof BaseStarRatingProps>

interface StarRatingProps extends BaseStarRatingProps {
	fieldsetProps?: HTMLFieldsetProps
}

export const StarRating = memo((props: StarRatingProps) => {
	const {
		className,
		size = 'medium',
		selectedValue,
		onChange,
		name,
		label,
		maxStars = 5,
		tabIndex = 0,
		disabled,
		readonly,
		precise,
		hiddenLegend = true,
		required,
		errorMessage,
		helperText,
		fieldsetProps,
	} = props

	const [fillValue, setFillValue] = useState<number>(selectedValue)
	const { isAnimating, startAnimation } = useAnimation(1000)

	const errorMessageId = useId()

	const handleChangeValue = useCallback((value: number) => {
		onChange(value)
	}, [onChange])

	const handleChangeFillValue = useCallback((value: number) => {
		setFillValue(value)
	}, [])

	useEffect(() => {
		setFillValue(selectedValue)
	}, [selectedValue])

	const mods: Record<string, boolean | undefined> = {
		[styles['hidden-legend']]: hiddenLegend,
		[styles['success']]: isAnimating,
		[styles['required']]: required,
		[styles['errored']]: !!errorMessage,
	}

	const renderStars = () => {
		return [...Array(maxStars)].map((_, index) => {
			const starValue = index + 1
			const isFullFilled = starValue <= fillValue
			const isThreeQuartersFilled = !isFullFilled && starValue - 0.25 <= fillValue
			const isHalfFilled =
				!isFullFilled && !isThreeQuartersFilled && starValue - 0.5 <= fillValue
			const isQuarterFilled =
				!isFullFilled &&
				!isThreeQuartersFilled &&
				!isHalfFilled &&
				starValue - 0.75 <= fillValue

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
					precise={precise}
					disabled={disabled}
					readonly={readonly}
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
			aria-readonly={readonly && 'true'}
			aria-required={required ? 'true' : 'false'}
			aria-errormessage={errorMessage && errorMessageId}
			{...fieldsetProps}
		>
			<legend className={styles['legend']}>{label}</legend>
			<div
				role="radiogroup"
				className={styles['stars-group']}
				onMouseLeave={() => handleChangeFillValue(selectedValue)}
				onMouseUp={readonly || disabled ? undefined : startAnimation}
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
