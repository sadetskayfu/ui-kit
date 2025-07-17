import { classNames, type AdditionalClasses, type Mods } from '@/shared/helpers/class-names';
import styles from '../ui/list-item.module.scss';

type ListItemBorderRadius = 'm' | 'none';

export interface UseClassNameProps {
	className?: string;
	active?: boolean;
	pressed?: boolean; // Вешает визуально стиль как и active, но еще добавляет атрибут aria-pressed
	disabled?: boolean;
	borderRadius?: ListItemBorderRadius;
}

export function useClassName({
	className: externalClassName,
	active: isActive,
	pressed: isPressed,
	disabled: isDisabled,
	borderRadius,
}: UseClassNameProps) {
	const additionalClasses: AdditionalClasses = [
		externalClassName,
		styles[`border-radius-${borderRadius}`],
	];

	const mods: Mods = {
		[styles['pressed']]: isPressed || isActive,
		[styles['disabled']]: isDisabled,
	};

	const className = classNames(styles['list-item'], additionalClasses, mods);

	return { className };
}
