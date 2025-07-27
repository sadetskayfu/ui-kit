import * as React from 'react';
import { ModernComponentProps } from '@/shared/helpers/types';
import { useId, useModernLayoutEffect, useRenderElement } from '@/shared/hooks';
import { useAlertRootContext } from '../root/alert-root-context';

/**
* Renders a `<span>` element.
*/
export const AlertTitle = React.forwardRef(
  (props: AlertTitle.Props, forwardedRef: React.ForwardedRef<HTMLSpanElement>) => {
    const { render, className, id: idProp, ...otherProps } = props;

    const { setTitleId } = useAlertRootContext()

    const id = useId(idProp)

    useModernLayoutEffect(() => {
        setTitleId(id)

        return () => {
            setTitleId(undefined)
        }
    }, [setTitleId])

    const element = useRenderElement('span', {
      render,
      className,
      ref: forwardedRef,
      props: [{ id }, otherProps],
    });

    return element;
  }
);

export namespace AlertTitle {
  export interface State {}
  export interface Props extends ModernComponentProps<'span', State> {}
}