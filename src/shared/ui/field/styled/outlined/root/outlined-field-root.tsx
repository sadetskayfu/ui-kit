import * as React from 'react';
import { classNames } from '@/shared/helpers/class-names';
import { BaseField } from '../../../base';
import { StyledFieldRootContext } from '../../styled-field-root-context';
import { OutlinedFieldRootContext } from './outlined-field-root-context';
import styles from '../outlined-field.module.scss';

export const OutlinedFieldRoot = (props: OutlinedFieldRoot.Props) => {
	const { className, children, size = 'm', fullWidth, required = false, ...otherProps } = props;

	const [withActions, setWithActions] = React.useState<boolean>(false);
	const [withStartAdornment, setWithStartAdornment] = React.useState<boolean>(false);
	const [withLabel, setWithLabel] = React.useState<boolean>(false);
	const [label, setLabel] = React.useState<string | number | undefined>(undefined);

	const contextValue: StyledFieldRootContext = React.useMemo(
		() => ({ setWithActions, setWithStartAdornment }),
		[]
	);
	const outlinedContextValue: OutlinedFieldRootContext = React.useMemo(
		() => ({ label, setLabel, required, withLabel, setWithLabel }),
		[label, required, withLabel]
	);

	return (
		<BaseField.Root
			className={state =>
				classNames(styles['container'], [className, styles[`size-${size}`]], {
					[styles['errored']]: state.errored,
					[styles['focused']]: state.focused,
					[styles['disabled']]: state.disabled,
					[styles['with-actions']]: withActions,
					[styles['with-start-adornment']]: withStartAdornment,
					[styles['full-width']]: fullWidth,
				})
			}
			required={required}
			{...otherProps}
		>
			<StyledFieldRootContext.Provider value={contextValue}>
				<OutlinedFieldRootContext.Provider value={outlinedContextValue}>
					{children}
				</OutlinedFieldRootContext.Provider>
			</StyledFieldRootContext.Provider>
		</BaseField.Root>
	);
};

export namespace OutlinedFieldRoot {
	export interface Props extends Omit<BaseField.Root.Props, 'render' | 'className'> {
		className?: string;
		/**
		 * @default 'm'
		 */
		size?: 'm' | 'l';
		fullWidth?: boolean;
	}
}
