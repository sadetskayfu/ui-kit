import * as React from 'react';
import { ModernComponentProps } from '@/shared/helpers/types';
import { useId, useModernLayoutEffect, useRenderElement } from '@/shared/hooks';
import { useDrawerRootContext } from '../root/drawer-root-context';

/**
* Renders a `<h2>` element.
*/
export const DrawerTitle = React.forwardRef(
  (props: DrawerTitle.Props, forwardedRef: React.ForwardedRef<HTMLHeadingElement>) => {
    const { render, className, id: idProp, ...otherProps } = props;

    const id = useId(idProp)

    const { setTitleId } = useDrawerRootContext()

    useModernLayoutEffect(() => {
        setTitleId(id)

        return () => {
            setTitleId(undefined)
        }
    }, [setTitleId, id])

    const element = useRenderElement('h2', {
      render,
      className,
      ref: forwardedRef,
      props: [{ id }, otherProps],
    });

    return element;
  }
);

export namespace DrawerTitle {
  export interface State {}
  export interface Props extends ModernComponentProps<'h2', State> {}
}