import * as React from 'react';
import { useModernLayoutEffect } from '@/shared/hooks';
import { FieldLabel } from '../../label/field-label';
import { useOutlinedFieldRootContext } from '../root/outlined-field-root-context';
import { classNames } from '@/shared/helpers/class-names';
import styles from '../outlined-field.module.scss'

export const OutlinedFieldLabel = React.memo((props: OutlinedFieldLabel.Props) => {
	const { children, hidden, className, ...otherProps } = props;

	const { setLabel, setWithLabel } = useOutlinedFieldRootContext();

	useModernLayoutEffect(() => {
		setLabel(children);
	}, [children, setLabel]);

	useModernLayoutEffect(() => {
		if (hidden) {
			setWithLabel(false);
		} else {
			setWithLabel(true);
		}

		return () => {
			setWithLabel(false);
		};
	}, [setWithLabel, hidden]);

	return (
		<FieldLabel className={classNames(styles['label'], [className])} hidden={hidden} {...otherProps}>
			{children}
		</FieldLabel>
	);
});

export namespace OutlinedFieldLabel {
	export interface Props extends FieldLabel.Props {}
}
