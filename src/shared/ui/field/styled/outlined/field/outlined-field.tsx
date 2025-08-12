import * as React from 'react';
import { BaseField } from '../../../base';
import { classNames } from '@/shared/helpers/class-names';
import { useBorderContext } from '@/shared/ui/border-provider';
import { useOutlinedFieldRootContext } from '../root/outlined-field-root-context';
import styles from '../outlined-field.module.scss';

export const OutlinedField = React.forwardRef(
	(props: OutlinedField.Props, forwardedRef: React.ForwardedRef<HTMLDivElement>) => {
		const { children, className, ...otherProps } = props;

        const { label, required, withLabel } = useOutlinedFieldRootContext()
		const borderContext = useBorderContext();

		return (
			<BaseField.Field
				ref={forwardedRef}
				className={classNames(styles['field'], [className, borderContext?.borderClassName])}
				{...otherProps}
			>
				{children}
				<fieldset aria-hidden="true">
					{withLabel && (
						<legend>
							<>
								{label}
								{required && ' *'}
							</>
						</legend>
					)}
				</fieldset>
			</BaseField.Field>
		);
	}
);

export namespace OutlinedField {
	export interface Props extends Omit<BaseField.Field.Props, 'render' | 'className'> {
		className?: string;
	}
}
