import { forwardRef, lazy, memo, type HTMLAttributes, type ReactElement } from 'react';
import { classNames, type Mods } from '@/shared/helpers/class-names';
import styles from './option-item.module.scss';

const CheckMarkIcon = lazy(() =>
	import('@/shared/ui/icons').then(module => ({
		default: module.CheckMarkIcon,
	}))
);

export interface OptionItemProps extends HTMLAttributes<HTMLLIElement> {
	active?: boolean;
	selected?: boolean;
	disabled?: boolean;
	notOption?: boolean; // Если эта опция не для выбора (чтобы не навигироваться по ней клавиатурой), к примеру мы хотим показать опцию "No options" когда нету ниодной опции
	value?: string;
	index?: number;
	centerContent?: boolean;
	checkMark?: boolean;
	renderCheckMark?: (props: { className: string }) => ReactElement;
}

export const OptionItem = memo(
	forwardRef((props: OptionItemProps, ref: React.ForwardedRef<HTMLLIElement>) => {
		const {
			className,
			children,
			id,
			value,
			index,
			active: isActive,
			selected: isSelected,
			disabled: isDisabled,
			notOption: isNotOption,
			centerContent: isCenterContent,
			role = 'option',
			checkMark: withCheckMark,
			renderCheckMark,
			...otherProps
		} = props;

		const mods: Mods = {
			[styles['active']]: isActive,
			[styles['selected']]: isSelected,
			[styles['disabled']]: isDisabled,
			[styles['not-option']]: isNotOption,
			[styles['center-content']]: isCenterContent,
		};

		return (
			<li
				className={classNames(styles['option'], [className], mods)}
				ref={ref}
				id={id}
				role={role}
				tabIndex={-1}
				aria-selected={isSelected ? 'true' : 'false'}
				aria-disabled={isDisabled ? 'true' : undefined}
				data-value={value}
				data-index={index}
				// Один из атрибутов для пропуска опции при навигации с клавиатуры, который используется в функции getNextEnabledOption
				data-is-not-option={isNotOption ? '' : undefined}
				{...otherProps}
			>
				{children}
				{isSelected &&
					(renderCheckMark ? (
						renderCheckMark({ className: styles['check-mark-icon'] })
					) : withCheckMark ? (
						<CheckMarkIcon
							variant="clear"
							color="primary"
							className={styles['check-mark-icon']}
						/>
					) : null)}
			</li>
		);
	})
);
