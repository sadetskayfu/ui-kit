import { classNames, type AdditionalClasses, type Mods } from '@/shared/helpers/class-names';
import styles from './circular-progress.module.scss';

type CircularProgressColor = 'primary' | 'secondary' | 'inherit';
type CircularProgressSize = 's' | 'm' | 'l';
type AriaAttributes = {
	'aria-label'?: string;
};

interface CircularProgressProps extends AriaAttributes {
	className?: string;
	size?: CircularProgressSize;
	color?: CircularProgressColor;
	zIndex?: number;
	absCenter?: boolean;
}

export const CircularProgress = (props: CircularProgressProps) => {
	const { className, size = 'l', color = 'primary', absCenter: isAbsCenter, zIndex, ...otherProps } = props;

	const additionalClasses: AdditionalClasses = [
		className,
		styles[`size-${size}`],
		styles[`color-${color}`],
	];

	const mods: Mods = {
		[styles['abs-center']]: isAbsCenter,
	};

	return (
		<span
			className={classNames(styles['circular-progress'], additionalClasses, mods)}
			role="progressbar"
			style={{
				zIndex,
			}}
			{...otherProps}
		>
			<svg className={styles['svg']}>
				<circle className={styles['circle']} />
			</svg>
		</span>
	);
}
