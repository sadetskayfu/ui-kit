import * as React from 'react';
import { ModernComponentProps } from '@/shared/helpers/types';
import { useId, useModernLayoutEffect, useRenderElement } from '@/shared/hooks';
import { useDrawerRootContext } from '../root/drawer-root-context';

/**
* Renders a `<p>` element.
*/
export const DrawerDescription = React.forwardRef(
  (props: DrawerDescription.Props, forwardedRef: React.ForwardedRef<HTMLParagraphElement>) => {
    const { render, className, id: idProp, ...otherProps } = props;

    const id = useId(idProp)

    const { setDescriptionId } = useDrawerRootContext()

    useModernLayoutEffect(() => {
        setDescriptionId(id)

        return () => {
            setDescriptionId(undefined)
        }
    }, [setDescriptionId, id])

    const element = useRenderElement('p', {
      render,
      className,
      ref: forwardedRef,
      props: [{ id }, otherProps],
    });

    return element;
  }
);

export namespace DrawerDescription {
  export interface State {}
  export interface Props extends ModernComponentProps<'p', State> {}
}