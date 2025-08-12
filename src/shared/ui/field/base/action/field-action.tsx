import * as React from 'react';
import { ModernComponentProps } from '@/shared/helpers/types';
import { useRenderElement } from '@/shared/hooks';
import { useFieldRootContext } from '../root/field-root-context'

/**
* Renders a `<button>` element.
*/
export const FieldAction = React.forwardRef(
  (props: FieldAction.Props, forwardedRef: React.ForwardedRef<HTMLButtonElement>) => {
    const { render, className, disabled: disabledProp, ...otherProps } = props;

    const { disabled, readOnly } = useFieldRootContext()

    const state: FieldAction.State = React.useMemo(() => ({ readOnly }), [readOnly])

    const element = useRenderElement('button', {
      render,
      className,
      state,
      ref: forwardedRef,
      props: [{ disabled: disabledProp || disabled }, otherProps],
    });

    return element;
  }
);

export namespace FieldAction {
  export interface State {
    readOnly: boolean
  }
  export interface Props extends ModernComponentProps<'button', State> {}
}