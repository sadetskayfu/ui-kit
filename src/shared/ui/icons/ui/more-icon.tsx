import { classNames, type AdditionalClasses } from '@/shared/helpers/class-names';
import { type IconProps } from '../types/icon-props';
import { memo } from 'react';
import styles from '../styles/styles.module.scss';

export const MoreIcon = memo((props: IconProps) => {
	const { className, color = 'inherit', size = 'inherit' } = props;

	const additionalClasses: AdditionalClasses = [
		className,
		styles[`color-${color}`],
		styles[`size-${size}`],
	];

	return (
		<svg
			className={classNames(styles['icon'], additionalClasses)}
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
		>
			<path
				fill="currentColor"
				d="M2 12a2 2 0 1 1 4 0a2 2 0 0 1-4 0m8 0a2 2 0 1 1 4 0a2 2 0 0 1-4 0m8 0a2 2 0 1 1 4 0a2 2 0 0 1-4 0"
			/>
		</svg>
	);
});
