import * as React from 'react'
import { FormHelperText } from '@/shared/ui/form-helper-text';
import { BaseField } from '../../base';
import { classNames } from '@/shared/helpers/class-names';
import styles from './field-helper-text.module.scss'

export const FieldHelperText = React.memo(({ children, className }: FieldHelperText.Props) => {
	return (
		<BaseField.HelperText
			render={(props, state) => (
				<FormHelperText className={classNames(styles['helper-text'], [className])} error={state.errored} {...props}>
					{children}
				</FormHelperText>
			)}
		/>
	);
});

export namespace FieldHelperText {
	export interface Props {
		className?: string;
		children: React.ReactNode;
	}
}
