import * as React from 'react';
import { useFormGroupContext } from '../form-group';
import { classNames } from '@/shared/helpers/class-names';
import {
	FormControlLabelContext,
	useFormControlLabelContext,
} from './provider/form-control-label-context';
import styles from './form-control-label.module.scss';

export const FormControlLabel = (props: FormControlLabel.Props) => {
	const { className, label, children, placement, color, required, disabled } = props;

	const labelId = React.useId();

	const groupContext = useFormGroupContext();
	const formControlLabelContext = useFormControlLabelContext();

	const isDisabled = disabled ?? groupContext?.disabled;

	const contextValue: FormControlLabelContext = React.useMemo(
		() => ({ disabled: isDisabled, required, labelId }),
		[isDisabled, required, labelId]
	);

	return (
		<label
			className={classNames(
				styles['form-control-label'],
				[
					className,
					styles[
						`placement-${placement || formControlLabelContext?.placement || 'right'}`
					],
					styles[`color-${color || formControlLabelContext?.color || 'soft'}`],
				],
				{ [styles['disabled']]: isDisabled }
			)}
		>
			<FormControlLabelContext.Provider value={contextValue}>
				{children}
			</FormControlLabelContext.Provider>
			<span className={styles['label']} id={labelId}>
				{label}
				{required && <span aria-hidden="true"> *</span>}
			</span>
		</label>
	);
};

export namespace FormControlLabel {
	export interface Props extends Omit<FormControlLabelContext, 'labelId'> {
		className?: string;
		label: string;
		children?: React.ReactElement;
	}
}
