import { useId } from 'react'
import { classNames } from '@/shared/helpers/classNames'
import styles from './style.module.scss'

export type StarSize = 'small' | 'medium'

interface StarProps {
	className?: string
	size?: StarSize
	value: number
	selectedValue: number
	name: string
	isFullFilled: boolean
	isThreeQuartersFilled: boolean
	isHalfFilled: boolean
	isQuarterFilled: boolean
	readOnly?: boolean
	disabled?: boolean
	isPrecise?: boolean
	tabIndex?: number
	onChange: (value: number) => void
	onChangeFillValue: (value: number) => void
}

export const Star = (props: StarProps) => {
	const {
		className,
		size = 'medium',
		value,
		selectedValue,
		name,
		isFullFilled,
		isThreeQuartersFilled,
		isHalfFilled,
		isQuarterFilled,
		disabled,
		readOnly,
		isPrecise,
		tabIndex = 0,
		onChange,
		onChangeFillValue,
	} = props

	const halfLabelId = useId()
	const labelId = useId()

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (readOnly) return

		onChange(Number(event.target.value))
	}

	const handleChangeFillValue = (value: number) => {
		if (readOnly) return

		onChangeFillValue(value)
	}

	const halfValue = value - 0.5
	const halfLabelTitle = `${halfValue} Stars`
	const labelTitle = value === 1 ? `${value} Star` : `${value} Stars`

	const mods: Record<string, boolean | undefined> = {
		[styles['full-filled']]: isFullFilled,
		[styles['three-quarters-filled']]: isThreeQuartersFilled,
		[styles['half-filled']]: isHalfFilled,
		[styles['quarter-filled']]: isQuarterFilled,
		[styles['readonly']]: readOnly,
		[styles['disabled']]: disabled,
	}

	const additionalClasses: Array<string | undefined> = [className, styles[size]]

	const localTabIndex = disabled || readOnly ? -1 : tabIndex

	return (
		<div className={classNames(styles['star'], additionalClasses, mods)}>
			{isPrecise && (
				<label
					className={styles['label']}
					onMouseEnter={() => handleChangeFillValue(halfValue)}
					onMouseDown={(event) => event.preventDefault()}
				>
					<input
						className={styles['input']}
						type="radio"
						value={halfValue}
						name={name}
						onChange={handleChange}
						checked={selectedValue === halfValue}
						readOnly={readOnly}
						disabled={disabled}
						tabIndex={localTabIndex}
						aria-labelledby={halfLabelId}
					/>
					<span className={styles['focus-border']}></span>
					<span id={halfLabelId} className="visually-hidden">
						{halfLabelTitle}
					</span>
				</label>
			)}
			<label
				className={styles['label']}
				onMouseEnter={() => handleChangeFillValue(value)}
				onMouseDown={(event) => event.preventDefault()}
			>
				<input
					className={styles['input']}
					type="radio"
					value={value}
					name={name}
					onChange={handleChange}
					checked={selectedValue === value}
					readOnly={readOnly}
					disabled={disabled}
					tabIndex={localTabIndex}
					aria-labelledby={labelId}
				/>
				<span className={styles['focus-border']}></span>
				<span id={labelId} className="visually-hidden">
					{labelTitle}
				</span>
			</label>
			<span className={styles['icon']}></span>
		</div>
	)
}
