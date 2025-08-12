import { classNames } from '@/shared/helpers/class-names';
import { useStyledFieldRootContext } from '../styled-field-root-context';
import { useModernLayoutEffect } from '@/shared/hooks';
import styles from './field-actions.module.scss';

export const FieldActions = (props: FieldActions.Props) => {
	const { children, className, offset, style } = props;

	const { setWithActions } = useStyledFieldRootContext()

	useModernLayoutEffect(() => {
		setWithActions(true)

		return () => {
			setWithActions(false)
		}
	}, [setWithActions])

	return (
		<div
			className={classNames(styles['field-actions'], [
				className,
				offset && styles[`offset-${offset}`],
			])}
			style={style}
		>
			{children}
		</div>
	);
};

export namespace FieldActions {
	export interface Props {
		className?: string;
		children?: React.ReactNode;
		/**
		 * Передайте offset равный размеру кнопок, если ваши кнопки имеют variant: clear, чтобы визуально отступ содержимого кнопок от края филда, был таким же как отступ инпута от края филда.
		 */
		offset?: 'xs' | 's' | 'm';
		style?: React.CSSProperties;
	}
}
