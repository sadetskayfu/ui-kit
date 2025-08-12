import * as React from 'react';
import { ModernComponentProps } from '@/shared/helpers/types';
import { useId, useModernLayoutEffect, useRenderElement } from '@/shared/hooks';
import { useFieldRootContext } from '../root/field-root-context';
import { ownerDocument } from '@/shared/helpers/owner';
import { activeElement } from '@floating-ui/react/utils';

/**
* Renders a `<span>` element.
*/
export const FieldLabel = React.forwardRef(
  (props: FieldLabel.Props, forwardedRef: React.ForwardedRef<HTMLSpanElement>) => {
    const { render, className, id: idProp, ...otherProps } = props;

    const id = useId(idProp)

    const { setLabelId, controlElementRef, focused, required, errored, disabled } = useFieldRootContext()

    useModernLayoutEffect(() => {
        setLabelId(id)

        return () => {
            setLabelId(undefined)
        }
    }, [id, setLabelId])

    const state: FieldLabel.State = React.useMemo(() => ({ focused, required, errored }), [focused, required, errored])

    const handleClick = () => {
        if (!disabled && activeElement(ownerDocument(controlElementRef.current)) !== controlElementRef.current ) {
            controlElementRef.current?.focus()
        }
    }

    const element = useRenderElement('span', {
      render,
      className,
      state,
      ref: forwardedRef,
      props: [{ id, onClick: handleClick }, otherProps],
    });

    return element;
  }
);

export namespace FieldLabel {
  export interface State {
    focused: boolean
    errored: boolean
    required: boolean
  }
  export interface Props extends ModernComponentProps<'span', State> {}
}