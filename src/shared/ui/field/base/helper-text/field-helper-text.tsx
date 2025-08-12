import * as React from 'react';
import { ModernComponentProps } from '@/shared/helpers/types';
import { useId, useModernLayoutEffect, useRenderElement } from '@/shared/hooks';
import { useFieldRootContext } from '../root/field-root-context';

/**
* Renders a `<p>` element.
*/
export const FieldHelperText = React.forwardRef(
  (props: FieldHelperText.Props, forwardedRef: React.ForwardedRef<HTMLParagraphElement>) => {
    const { render, className, id: idProp, ...otherProps } = props;

    const id = useId(idProp)

    const { setHelperTextId, errored } = useFieldRootContext()

    useModernLayoutEffect(() => {
        setHelperTextId(id)

        return () => {
            setHelperTextId(undefined)
        }
    }, [id, setHelperTextId])

    const state: FieldHelperText.State = React.useMemo(() => ({errored}), [errored])

    const element = useRenderElement('p', {
      render,
      className,
      state,
      ref: forwardedRef,
      props: [{ id }, otherProps],
    });

    return element;
  }
);

export namespace FieldHelperText {
  export interface State {
    errored: boolean
  }
  export interface Props extends ModernComponentProps<'p', State> {}
}