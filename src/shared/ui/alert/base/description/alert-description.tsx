import * as React from 'react';
import { ModernComponentProps } from '@/shared/helpers/types';
import { useId, useModernLayoutEffect, useRenderElement } from '@/shared/hooks';
import { useAlertRootContext } from '../root/alert-root-context';

/**
* Renders a `<p>` element.
*/
export const AlertDescription = React.forwardRef(
  (props: AlertDescription.Props, forwardedRef: React.ForwardedRef<HTMLParagraphElement>) => {
    const { render, className, id: idProp, ...otherProps } = props;

    const { setDescriptionId } = useAlertRootContext()

    const id = useId(idProp)

    useModernLayoutEffect(() => {
        setDescriptionId(id)

        return () => {
            setDescriptionId(undefined)
        }
    }, [setDescriptionId])

    const element = useRenderElement('p', {
      render,
      className,
      ref: forwardedRef,
      props: [{ id }, otherProps],
    });

    return element;
  }
);

export namespace AlertDescription {
  export interface State {}
  export interface Props extends ModernComponentProps<'p', State> {}
}