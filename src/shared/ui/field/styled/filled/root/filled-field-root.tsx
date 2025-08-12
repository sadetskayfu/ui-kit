import * as React from 'react'
import { classNames } from '@/shared/helpers/class-names';
import { BaseField } from '../../../base';
import { StyledFieldRootContext } from '../../styled-field-root-context';
import styles from '../filled-field.module.scss';

export const FilledFieldRoot = (props: FilledFieldRoot.Props) => {
	const { className, children, size = 'm', fullWidth, ...otherProps } = props;

    const [withActions, setWithActions] = React.useState<boolean>(false)
    const [withStartAdornment, setWithStartAdornment] = React.useState<boolean>(false)

    const contextValue: StyledFieldRootContext = React.useMemo(() => ({ setWithActions, setWithStartAdornment }), [])

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
            {...otherProps}
		>
			<StyledFieldRootContext.Provider value={contextValue}>
                {children}
            </StyledFieldRootContext.Provider>
		</BaseField.Root>
	);
};

export namespace FilledFieldRoot {
	export interface Props extends Omit<BaseField.Root.Props, 'render' | 'className'> {
		className?: string;
		/**
		 * @default 'm'
		 */
		size?: 'm' | 'l';
        fullWidth?: boolean
	}
}
