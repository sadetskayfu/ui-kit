import * as React from 'react';
import { classNames } from '@/shared/helpers/class-names';
import { BaseSelect } from '../../base';
import { CheckMarkIcon } from '@/shared/ui/icons';
import { useBorderContext } from '@/shared/ui/border-provider';
import styles from './select-item.module.scss';

export const SelectItem = React.memo((props: SelectItem.Props) => {
	const { className, children, size = 'm', ...otherProps } = props;

	const borderContext = useBorderContext()

	return (
		<BaseSelect.Item
			{...otherProps}
			className={state =>
				classNames(styles['item'], [className, borderContext?.borderClassName, styles[`size-${size}`]], {
					[styles['active']]: state.active,
					[styles['selected']]: state.selected,
                    [styles['disabled']]: state.disabled,
				})
			}
		>
            {children}
            <BaseSelect.ItemIndicator className={styles['indicator']}>
                <CheckMarkIcon variant='clear' color='primary' />
            </BaseSelect.ItemIndicator>
        </BaseSelect.Item>
	);
});

export namespace SelectItem {
	export interface Props extends Omit<BaseSelect.Item.Props, 'className' | 'render'> {
        children?: React.ReactNode
		className?: string;
		/**
		 * @default 'm'
		 */
		size?: 'm' | 'l'
	}
}
