import * as React from 'react';
import { ModernComponentProps } from '@/shared/helpers/types';
import { useRenderElement } from '@/shared/hooks';
import { useAvatarRootContext } from '../root/avatar-root-context';

/**
* Renders a `<span>` element.
*/
export const AvatarFallback = React.forwardRef(
  (props: AvatarFallback.Props, forwardedRef: React.ForwardedRef<HTMLSpanElement>) => {
    const { render, className,  ...otherProps } = props;

    const { imageLoadingStatus } = useAvatarRootContext();

    const element = useRenderElement('span', {
      render,
      className,
      ref: forwardedRef,
      props: otherProps,
      enabled: imageLoadingStatus !== 'loaded'
    });

    return element;
  }
);

export namespace AvatarFallback {
  export interface State {}
  export interface Props extends ModernComponentProps<'span', State> {}
}