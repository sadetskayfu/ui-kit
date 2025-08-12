import { classNames } from '@/shared/helpers/class-names';
import { useStyledFieldRootContext } from '../styled-field-root-context';
import { useModernLayoutEffect } from '@/shared/hooks';
import styles from './field-start-adornment.module.scss';

export const FieldStartAdornment = (props: FieldStartAdornment.Props) => {
	const { children, className, style } = props;

	const { setWithStartAdornment } = useStyledFieldRootContext()

	useModernLayoutEffect(() => {
		setWithStartAdornment(true)

		return () => {
			setWithStartAdornment(false)
		}
	}, [])

	return (
		<div className={classNames(styles['field-start-adornment'], [className])} style={style}>
			{children}
		</div>
	);
};

export namespace FieldStartAdornment {
	export interface Props {
		className?: string;
		children?: React.ReactNode;
		style?: React.CSSProperties;
	}
}
