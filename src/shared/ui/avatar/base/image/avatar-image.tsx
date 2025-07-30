import * as React from 'react';
import { ModernComponentProps } from '@/shared/helpers/types';
import { useEventCallback, useModernLayoutEffect, useRenderElement } from '@/shared/hooks';
import { ImageLoadingStatus, useImageLoadingStatus } from './use-image-loading-status';
import { useAvatarRootContext } from '../root/avatar-root-context';

/**
* Renders a `<image>` element.
*/
export const AvatarImage = React.forwardRef(
  (props: AvatarImage.Props, forwardedRef: React.ForwardedRef<HTMLImageElement>) => {
    const { render, className, onLoadingStatusChange, referrerPolicy, crossOrigin, ...otherProps } = props;

    const { setImageLoadingStatus } = useAvatarRootContext();

    const imageLoadingStatus = useImageLoadingStatus(props.src, {
      referrerPolicy,
      crossOrigin,
    });

    const handleLoadingStatusChange = useEventCallback((status: ImageLoadingStatus) => {
        onLoadingStatusChange?.(status);
        setImageLoadingStatus(status);
      });

      useModernLayoutEffect(() => {
        if (imageLoadingStatus !== 'idle') {
          handleLoadingStatusChange(imageLoadingStatus);
        }
      }, [imageLoadingStatus, handleLoadingStatusChange]);

    const element = useRenderElement('img', {
      render,
      className,
      ref: forwardedRef,
      props: otherProps,
      enabled: imageLoadingStatus === 'loaded'
    });

    return element;
  }
);

export namespace AvatarImage {
  export interface State {}
  export interface Props extends ModernComponentProps<'img', State> {
    onLoadingStatusChange?: (status: ImageLoadingStatus) => void
  }
}