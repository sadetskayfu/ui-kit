import * as React from 'react';
import { ModernComponentProps } from '@/shared/helpers/types';
import { useRenderElement } from '@/shared/hooks';
import { useSelectRootContext } from '../root/select-root-context';
import { useStore } from '@/shared/lib/store';
import { selectors } from '../store';

/**
 * Renders a `<button>` element.
 */
export const SelectClear = React.forwardRef(
	(props: SelectClear.Props, forwardedRef: React.ForwardedRef<HTMLButtonElement>) => {
		const { render, className, keepMounted = false, ...otherProps } = props;

		const { store, multiple, onChange, disabled, readOnly, minValueLength } =
			useSelectRootContext();

		const selectedValue = useStore(store, selectors.selectedValue);

        const isDirty = (multiple && Array.isArray(selectedValue)) ? selectedValue.length > minValueLength : minValueLength === 0

		const element = useRenderElement('button', {
			render,
			className,
			ref: forwardedRef,
            enabled: isDirty || keepMounted,
			props: [
				{
					onClick: () => {
						if (disabled || readOnly) {
							return;
						}

						if (multiple && Array.isArray(selectedValue)) {
							if (minValueLength >= selectedValue.length) {
								return;
							} else {
								if (minValueLength === 0) {
									onChange([]);
                                    store.set('selectedValue', [])
								} else {
									const newSelectedValue: string[] = [];

									selectedValue.forEach((value, index) => {
										if (index < minValueLength) {
											newSelectedValue.push(value);
										}
									});

									onChange(newSelectedValue);
                                    store.set('selectedValue', newSelectedValue)
								}
							}
						} else {
                            if (minValueLength > 0) {
                                return
                            } else {
                                onChange('')
                                store.set('selectedValue', '')
                            }
                        }
					},
					tabIndex: -1,
					disabled,
				},
				otherProps,
			],
		});

		return element;
	}
);

export namespace SelectClear {
	export interface State {
    }
	export interface Props extends ModernComponentProps<'button', State> {
        keepMounted?: boolean
    }
}
