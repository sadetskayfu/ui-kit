import * as React from 'react';
import { classNames } from '@/shared/helpers/class-names';
import { BaseSelect } from '../../base';
import styles from './select-group-label.module.scss';

export const SelectGroupLabel = React.memo((props: SelectGroupLabel.Props) => {
	const { className, children, size = 'm', ...otherProps } = props;

	return (
		<BaseSelect.GroupLabel
			className={classNames(styles['group-label'], [className, styles[`size-${size}`]])}
			{...otherProps}
		>
			{children}
		</BaseSelect.GroupLabel>
	);
});

export namespace SelectGroupLabel {
	export interface Props extends Omit<BaseSelect.GroupLabel.Props, 'className' | 'render'> {
		className?: string;
		/**
		 * @default 'm'
		 */
		size?: 'm' | 'l';
	}
}
