import * as React from 'react';
import { ModernComponentProps } from '@/shared/helpers/types';
import { useRenderElement } from '@/shared/hooks';
import styles from '../chip.module.scss'

/**
* Renders a `<span>` element.
*/
export const ChipLabel = React.forwardRef(
  (props: ChipLabel.Props, forwardedRef: React.ForwardedRef<HTMLSpanElement>) => {
    const { render, className, ...otherProps } = props;

    const element = useRenderElement('span', {
      render,
      className,
      ref: forwardedRef,
      props: [{className: styles['label']}, otherProps],
    });

    return element;
  }
);

export namespace ChipLabel {
  export interface State {}
  export interface Props extends ModernComponentProps<'span', State> {}
}