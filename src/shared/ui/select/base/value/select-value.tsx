import * as React from 'react';
import { ModernComponentProps } from '@/shared/helpers/types';
import { useRenderElement } from '@/shared/hooks';
import { useSelectRootContext } from '../root/select-root-context';
import { useStore } from '@/shared/lib/store';
import { selectors } from '../store';

/**
* Renders a `<span>` element.
*/
export const SelectValue = React.forwardRef(
  (props: SelectValue.Props, forwardedRef: React.ForwardedRef<HTMLSpanElement>) => {
    const { render, className, children, placeholder, ...otherProps } = props;

    const { store, multiple, onDelete } = useSelectRootContext()

    const selectedValue = useStore(store, selectors.selectedValue)

    const state: SelectValue.State = React.useMemo(() => ({ selectedValue, onDelete }), [selectedValue, onDelete])

    const displayValue = React.useMemo(() => {
        if (render || children) {
            return children
        }

        if (selectedValue.length === 0 && placeholder) {
            return placeholder
        }

        if (multiple && Array.isArray(selectedValue)) {
            return `${selectedValue[0]}` + (selectedValue.length > 1 ? ` (+${selectedValue.length - 1})` : '')
        } else {
            return `${selectedValue}`
        }
    }, [children, placeholder, multiple, render, selectedValue])

    const element = useRenderElement('span', {
      render,
      className,
      state,
      ref: forwardedRef,
      props: [{ children: displayValue }, otherProps],
    });

    return element;
  }
);

export namespace SelectValue {
  export interface State {
    selectedValue: string | string[]
    onDelete: (value: string) => void
  }
  export interface Props extends ModernComponentProps<'span', State> {
    placeholder?: string
  }
}