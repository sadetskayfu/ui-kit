import * as React from 'react';
import { ModernComponentProps } from '@/shared/helpers/types';
import { useRenderElement } from '@/shared/hooks';
import { useSelectRootContext } from '../root/select-root-context';
import { useStore } from '@/shared/lib/store';
import { selectors } from '../store';

/**
* Renders a `<span>` element.
*/
export const SelectIcon = React.forwardRef(
  (props: SelectIcon.Props, forwardedRef: React.ForwardedRef<HTMLSpanElement>) => {
    const { render, className, ...otherProps } = props;

    const { store } = useSelectRootContext()

    const open = useStore(store, selectors.open)

    const state: SelectIcon.State = React.useMemo(() => ({open}), [open])

    const element = useRenderElement('span', {
      render,
      className,
      state,
      ref: forwardedRef,
      props: [otherProps],
    });

    return element;
  }
);

export namespace SelectIcon {
  export interface State {
    open: boolean
  }
  export interface Props extends ModernComponentProps<'span', State> {}
}