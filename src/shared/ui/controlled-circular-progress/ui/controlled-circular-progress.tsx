import { useEffect, useMemo, useRef } from 'react';
import { getCircleParams, getOffset } from '../helpers';
import { classNames, type AdditionalClasses, type Mods } from '@/shared/helpers/class-names';
import styles from './controlled-circular-progress.module.scss';

type CircularProgressColor = 'primary' | 'secondary' | 'inherit';
type AriaAttributes = {
	'aria-label'?: string;
};

interface ControlledCircularProgressProps extends AriaAttributes {
	className?: string;
	size?: number;
	fontSize?: number;
	strokeWidth?: number;
	color?: CircularProgressColor;
	value: number;
	maxValue: number;
	minValue: number;
	label?: string | number;
	zIndex?: number;
	absCenter?: boolean;
}

export const ControlledCircularProgress = (props: ControlledCircularProgressProps) => {
	const {
		className,
		value,
		maxValue,
		minValue,
		color = 'inherit',
		size = 24,
		fontSize,
		strokeWidth = 2,
		absCenter: isAbsCenter,
		label,
		zIndex,
		...otherProps
	} = props;

	const circleRef = useRef<SVGCircleElement>(null);

	const { radius, circumferenceLength } = useMemo(
		() => getCircleParams(size, strokeWidth),
		[size, strokeWidth]
	);

	const initialStrokeDashoffset = useMemo(
		() => getOffset(value, minValue, maxValue, circumferenceLength),
		[value, minValue, maxValue, circumferenceLength]
	);

	useEffect(() => {
		const circle = circleRef.current;

		if (circle) {
			const offset = getOffset(value, minValue, maxValue, circumferenceLength);
			circle.setAttribute('stroke-dashoffset', `${offset}px`);
		}
	}, [value, maxValue, minValue, circumferenceLength]);

	const additionalClasses: AdditionalClasses = [className, styles[`color-${color}`]];

	const mods: Mods = {
		[styles['abs-center']]: isAbsCenter,
	};

	return (
		<span
			className={classNames(styles['circular-progress'], additionalClasses, mods)}
			role="progressbar"
			aria-valuemax={maxValue}
			aria-valuemin={minValue}
			aria-valuenow={value}
			style={{
				zIndex,
				width: size,
				height: size,
			}}
			{...otherProps}
		>
			<svg className={styles['svg']}>
				<circle
					className={styles['circle']}
					ref={circleRef}
					r={radius}
					strokeWidth={strokeWidth}
					strokeDasharray={circumferenceLength}
					strokeDashoffset={initialStrokeDashoffset}
					cy={size / 2}
					cx={size / 2}
				/>
			</svg>
			{label != null && (
				<span
					style={{ fontSize: fontSize ?? size / 3 }}
					className={styles['label']}
					aria-hidden="true"
				>
					{label}
				</span>
			)}
		</span>
	);
}
