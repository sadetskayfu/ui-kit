import * as React from 'react'
import { classNames } from '@/shared/helpers/class-names';
import { BaseField } from '../../base';
import styles from './field-control.module.scss';

export const FieldControl = React.forwardRef((props: FieldControl.Props, forwardedRef: React.ForwardedRef<HTMLInputElement>) => {
	const { className, ...otherProps } = props;

	return (
		<BaseField.Control
			{...otherProps}
			ref={forwardedRef}
            data-field-control=''
			className={classNames(styles['field-control'], [className])}
		/>
	);
});

export namespace FieldControl {
	export interface Props extends Omit<BaseField.Control.Props, 'className'> {
		className?: string;
	}
}
