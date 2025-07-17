import { classNames, type AdditionalClasses } from '@/shared/helpers/class-names';
import { type IconProps } from '../types/icon-props';
import { memo } from 'react';
import styles from '../styles/styles.module.scss';

type CheckMarkIconVariant = 'clear' | 'filled' | 'outlined';

export const CheckMarkIcon = memo((props: IconProps & { variant: CheckMarkIconVariant }) => {
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
			{variant === 'outlined' && (
				<>
					<path
						fill="currentColor"
						d="m14 21.414l-5-5.001L10.413 15L14 18.586L21.585 11L23 12.415z"
					/>
					<path
						fill="currentColor"
						d="M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2m0 26a12 12 0 1 1 12-12a12 12 0 0 1-12 12"
					/>
				</>
			)}
			{variant === 'filled' && (
				<>
					<path
						fill="currentColor"
						d="M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2m-2 19.59l-5-5L10.59 15L14 18.41L21.41 11l1.596 1.586Z"
					/>
					<path
						fill="currentColor"
						d="m14 21.591l-5-5L10.591 15L14 18.409L21.41 11l1.595 1.585z"
					/>
				</>
			)}
			{variant === 'clear' && (
				<>
					<path
						fill="currentColor"
						d="m13 24l-9-9l1.414-1.414L13 21.171L26.586 7.586L28 9z"
					/>
				</>
			)}
		</svg>
	);
});
