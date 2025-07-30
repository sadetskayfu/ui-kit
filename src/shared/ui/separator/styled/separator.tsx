import * as React from 'react'
import { classNames } from '@/shared/helpers/class-names';
import { BaseSeparator } from '../base';
import styles from './separator.module.scss';

export const Separator = React.memo(({ className, ...otherProps }: Separator.Props) => {
	return (
		<BaseSeparator
			className={state =>
				classNames(styles['separator'], [
					className,
					styles[`orientation-${state.orientation}`],
				])
			}
			{...otherProps}
		/>
	);
});

export namespace Separator {
	export interface Props extends Omit<BaseSeparator.Props, 'className'> {
		className?: string;
	}
}
