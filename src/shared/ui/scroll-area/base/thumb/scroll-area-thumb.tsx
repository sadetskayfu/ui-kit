import React from "react";
import type { HTMLProps, ModernComponentProps } from "@/shared/helpers/types";
import { useRenderElement } from "@/shared/hooks";
import { useScrollAreaRootContext } from "../root/scroll-area-root-context";
import { useScrollAreaScrollbarContext } from "../scrollbar/scroll-area-scrollbar-context";
import { classNames } from "@/shared/helpers/class-names";
import { ScrollAreaScrollbarDataAttributes } from "../scrollbar/scroll-area-scrollbar-data-attributes";
import styles from './scroll-area-thumb.module.scss'

export const ScrollAreaThumb = React.forwardRef((props: ScrollAreaThumb.Props, forwardedRef: React.ForwardedRef<HTMLDivElement>) => {
    const { className, ...otherProps } = props

    const {
        thumbYRef,
        thumbXRef,
        handlePointerDown,
        handlePointerMove,
        handlePointerUp,
        setScrollingX,
        setScrollingY,
      } = useScrollAreaRootContext();

    const { orientation } = useScrollAreaScrollbarContext()

    const localProps: HTMLProps = {
        className: classNames(styles['base-thumb'], [styles[`orientation-${orientation}`]]),
        [ScrollAreaScrollbarDataAttributes.orientation as string]: `${orientation}`,
        onPointerDown: handlePointerDown,
        onPointerMove: handlePointerMove,
        onPointerUp(event) {
            if (orientation === 'vertical') {
                setScrollingY(false)
            }
            if(orientation === 'horizontal') {
                setScrollingX(false)
            }
            handlePointerUp(event)
        },
    }

    const element = useRenderElement('div', {
        props: [localProps, otherProps],
        ref: [forwardedRef, orientation === 'vertical' ? thumbYRef : thumbXRef],
        className,
    })

    return element
})

export namespace ScrollAreaThumb {
    export interface Props extends ModernComponentProps<'div'> {}
}