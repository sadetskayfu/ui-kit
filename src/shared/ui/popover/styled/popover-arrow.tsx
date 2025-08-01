import { PopupArrow } from "../../popup-arrow"
import { BasePopover } from "../base"

export const PopoverArrow = ({ className, ...otherProps }: PopoverArrow.Props) => {
    return (
        <BasePopover.Arrow {...otherProps} render={(props, state) => <PopupArrow className={className} side={state.side} {...props} />} />
    )
}

export namespace PopoverArrow {
    export interface Props extends Omit<BasePopover.Arrow.Props, 'className' | 'render'> {
        className?: string
    }
}