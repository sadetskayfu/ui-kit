import * as React from 'react';
import { ModernComponentProps } from '@/shared/helpers/types';
import { useId, useModernLayoutEffect, useRenderElement } from '@/shared/hooks';
import { useAsideMenuRootContext } from '../root/aside-menu-root-context';

/**
* Renders a `<p>` element.
*/
export const AsideMenuDescription = React.forwardRef(
  (props: AsideMenuDescription.Props, forwardedRef: React.ForwardedRef<HTMLParagraphElement>) => {
    const { render, className, id: idProp, ...otherProps } = props;

    const id = useId(idProp)

    const { setDescriptionId } = useAsideMenuRootContext()

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

export namespace AsideMenuDescription {
  export interface State {}
  export interface Props extends ModernComponentProps<'p', State> {}
}