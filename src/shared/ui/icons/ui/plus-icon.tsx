import { classNames, type AdditionalClasses } from '@/shared/helpers/class-names';
import { type IconProps } from '../types/icon-props';
import { memo } from 'react';
import styles from '../styles/styles.module.scss';

export const PlusIcon = memo((props: IconProps) => {
	const { className, color = 'inherit', size = 'inherit' } = props;

	const additionalClasses: AdditionalClasses = [
		className,
		styles[`color-${color}`],
		styles[`size-${size}`],
	];

	return (
		<svg
			className={classNames(styles['icon'], additionalClasses)}
			viewBox="0 0 18 18"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
		>
			<path
				fill="currentColor"
				d="M9 0.75C9.41421 0.75 9.75 1.08579 9.75 1.5V8.25H16.5C16.9142 8.25 17.25 8.58579 17.25 9C17.25 9.41421 16.9142 9.75 16.5 9.75H9.75V16.5C9.75 16.9142 9.41421 17.25 9 17.25C8.58579 17.25 8.25 16.9142 8.25 16.5V9.75H1.5C1.08579 9.75 0.75 9.41421 0.75 9C0.75 8.58579 1.08579 8.25 1.5 8.25H8.25V1.5C8.25 1.08579 8.58579 0.75 9 0.75Z"
			/>
		</svg>
	);
});
