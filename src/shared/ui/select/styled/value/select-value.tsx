import { classNames } from '@/shared/helpers/class-names';
import { BaseSelect } from '../../base';
import styles from './select-value.module.scss';

export const SelectValue = (props: SelectValue.Props) => {
    const { className, ...otherProps } = props

	return (
		<BaseSelect.Value
			className={state =>
				classNames(styles['value'], [className], {
					[styles[`is-placeholder`]]: Boolean(state.selectedValue.length === 0),
				})
			}
            {...otherProps}
		/>
	);
};

export namespace SelectValue {
	export interface Props extends Omit<BaseSelect.Value.Props, 'className'> {
        className?: string
    }
}
