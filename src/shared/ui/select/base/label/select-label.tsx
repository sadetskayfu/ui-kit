import * as React from 'react';
import { ModernComponentProps } from '@/shared/helpers/types';
import { useId, useModernLayoutEffect, useRenderElement } from '@/shared/hooks';
import { useSelectRootContext } from '../root/select-root-context';

/**
* Renders a `<span>` element.
*/
export const SelectLabel = React.forwardRef(
  (props: SelectLabel.Props, forwardedRef: React.ForwardedRef<HTMLSpanElement>) => {
    const { render, className, id: idProp, ...otherProps } = props;

    const id = useId(idProp)

    const { setLabelId, required } = useSelectRootContext()

    useModernLayoutEffect(() => {
        setLabelId(id)

        return () => {
            setLabelId(undefined)
        }
    }, [setLabelId, id])

    const state: SelectLabel.State = React.useMemo(() => ({required}), [required])

    const element = useRenderElement('span', {
      render,
      className,
      state,
      ref: forwardedRef,
      props: [{id}, otherProps],
    });

    return element;
  }
);

export namespace SelectLabel {
  export interface State {
    required: boolean
  }
  export interface Props extends ModernComponentProps<'span', State> {}
}