import { classNames, type AdditionalClasses } from '@/shared/helpers/class-names';
import { type IconProps } from '../types/icon-props';
import { memo } from 'react';
import styles from '../styles/styles.module.scss';

type XMarkIconVariant = 'clear' | 'filled' | 'outlined';

export const XMarkIcon = memo((props: IconProps & { variant?: XMarkIconVariant }) => {
	const { className, color = 'inherit', size = 'inherit', variant = 'clear' } = props;

	const additionalClasses: AdditionalClasses = [
		className,
		styles[`color-${color}`],
		styles[`size-${size}`],
	];

	return (
		<svg
			className={classNames(styles['icon'], additionalClasses)}
			viewBox="0 0 32 32"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
		>
			{variant === 'clear' && (
				<>
					<path
						fill="currentColor"
						d="M17.414 16L26 7.414L24.586 6L16 14.586L7.414 6L6 7.414L14.586 16L6 24.586L7.414 26L16 17.414L24.586 26L26 24.586z"
					/>
				</>
			)}
			{variant === 'outlined' && (
				<>
					<path
						fill="currentColor"
						d="M16 2C8.2 2 2 8.2 2 16s6.2 14 14 14s14-6.2 14-14S23.8 2 16 2m0 26C9.4 28 4 22.6 4 16S9.4 4 16 4s12 5.4 12 12s-5.4 12-12 12"
					/>
					<path
						fill="currentColor"
						d="M21.4 23L16 17.6L10.6 23L9 21.4l5.4-5.4L9 10.6L10.6 9l5.4 5.4L21.4 9l1.6 1.6l-5.4 5.4l5.4 5.4z"
					/>
				</>
			)}
			{variant === 'filled' && (
				<>
					<path
						fill="currentColor"
						d="M16 2C8.2 2 2 8.2 2 16s6.2 14 14 14s14-6.2 14-14S23.8 2 16 2m5.4 21L16 17.6L10.6 23L9 21.4l5.4-5.4L9 10.6L10.6 9l5.4 5.4L21.4 9l1.6 1.6l-5.4 5.4l5.4 5.4z"
					/>
				</>
			)}
		</svg>
	);
});
