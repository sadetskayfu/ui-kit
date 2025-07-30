import * as React from 'react';
import { ModernComponentProps } from '@/shared/helpers/types';
import { useRenderElement } from '@/shared/hooks';

/**
* Renders a `<div>` element.
*/
export const Separator = React.forwardRef(
  (props: Separator.Props, forwardedRef: React.ForwardedRef<HTMLDivElement>) => {
    const { render, className, orientation, ...otherProps } = props;

    const state: Separator.State = React.useMemo(() => ({orientation}), [orientation])

    const element = useRenderElement('div', {
      render,
      className,
      state,
      ref: forwardedRef,
      props: [{ role: 'separator', 'aria-orientation': orientation }, otherProps],
    });

    return element;
  }
);

export namespace Separator {
  export interface State {
    orientation: 'horizontal' | 'vertical'
  }
  export interface Props extends ModernComponentProps<'div', State> {
    orientation: 'horizontal' | 'vertical'
  }
}