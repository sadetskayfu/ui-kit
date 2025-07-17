import { classNames, type AdditionalClasses } from '@/shared/helpers/class-names';
import { type IconProps } from '../types/icon-props';
import { memo } from 'react';
import styles from '../styles/styles.module.scss';

export const EditIcon = memo((props: IconProps) => {
	const { className, color = 'inherit', size = 'inherit' } = props;

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
			aria-hidden='true'
		>
			<path
				fill="currentColor"
				d="M2 26h28v2H2zM25.4 9c.8-.8.8-2 0-2.8l-3.6-3.6c-.8-.8-2-.8-2.8 0l-15 15V24h6.4zm-5-5L24 7.6l-3 3L17.4 7zM6 22v-3.6l10-10l3.6 3.6l-10 10z"
			/>
		</svg>
	);
});
