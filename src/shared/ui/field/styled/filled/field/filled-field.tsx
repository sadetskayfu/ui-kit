import * as React from 'react';
import { BaseField } from '../../../base';
import { classNames } from '@/shared/helpers/class-names';
import { useBorderContext } from '@/shared/ui/border-provider';
import styles from '../filled-field.module.scss'

export const FilledField = React.forwardRef(
	(props: FilledField.Props, forwardedRef: React.ForwardedRef<HTMLDivElement>) => {
        const { children, className, ...otherProps } = props

        const borderContext = useBorderContext()

		return (
			<BaseField.Field
				ref={forwardedRef}
				className={classNames(styles['field'], [className, borderContext?.borderClassName])}
				{...otherProps}
			>
				{children}
			</BaseField.Field>
		);
	}
);

export namespace FilledField {
	export interface Props extends Omit<BaseField.Field.Props, 'render' | 'className'> {
		className?: string;
	}
}
