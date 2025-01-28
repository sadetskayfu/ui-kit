import { ToggleButtonProps } from '@/shared/ui/ToggleButton/ui/ToggleButton'
import { Children, cloneElement, ReactElement } from 'react'
import { classNames } from '@/shared/helpers/classNames'
import { isValueSelected } from '@/shared/helpers/checkingValues'
import styles from './style.module.scss'

type ToggleButtonOrientation = 'horizontal' | 'vertical'

type AriaAttribute = {
	'aria-label'?: string
    'aria-labelledby'?: string
}

interface ToggleButtonGroupProps extends AriaAttribute {
	className?: string
	children: ReactElement<ToggleButtonProps>[]
	selectedValue: string | string[]
	orientation?: ToggleButtonOrientation
    isClearedBorderRadius?: boolean
	onChange: (value: string) => void
}

export const ToggleButtonGroup = (props: ToggleButtonGroupProps) => {
	const {
		className,
		children,
		selectedValue,
		orientation = 'horizontal',
        isClearedBorderRadius = true,
		onChange,
		...otherProps
	} = props

	const renderToggleButtons = () => {
		return Children.map(children, (toggleButton, index) => {
			const toggleButtonValue = toggleButton.props.value
			let toggleButtonClassName: string = styles['other-button']

			switch (index) {
				case 0:
					toggleButtonClassName = styles['first-button']
					break
				case children.length - 1:
					toggleButtonClassName = styles['last-button']
					break
				default:
					break
			}

            const isSelected = isValueSelected(toggleButtonValue, selectedValue)

			return cloneElement(toggleButton, {
                className: toggleButtonClassName,
				isSelected,
				onChange,
				key: toggleButtonValue,
			})
		})
	}

	const additionalClasses: Array<string | undefined> = [
		className,
		styles[orientation],
	]

    const mods: Record<string, boolean | undefined> = {
        [styles['cleared-border-radius']]: isClearedBorderRadius
    }

	return (
		<div
			className={classNames(styles['toggle-button-group'], additionalClasses, mods)}
			role="group"
			{...otherProps}
		>
			{renderToggleButtons()}
		</div>
	)
}
