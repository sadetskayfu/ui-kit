import * as React from 'react';
import { ModernComponentProps } from '@/shared/helpers/types';
import { useId, useModernLayoutEffect, useRenderElement } from '@/shared/hooks';
import { useAsideMenuRootContext } from '../root/aside-menu-root-context';

/**
* Renders a `<h2>` element.
*/
export const AsideMenuTitle = React.forwardRef(
  (props: AsideMenuTitle.Props, forwardedRef: React.ForwardedRef<HTMLHeadingElement>) => {
    const { render, className, id: idProp, ...otherProps } = props;

    const id = useId(idProp)

    const { setTitleId } = useAsideMenuRootContext()

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

export namespace AsideMenuTitle {
  export interface State {}
  export interface Props extends ModernComponentProps<'h2', State> {}
}