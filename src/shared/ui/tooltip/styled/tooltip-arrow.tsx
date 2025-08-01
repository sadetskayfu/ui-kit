import { PopupArrow } from "../../popup-arrow"
import { BaseTooltip } from "../base"

export const TooltipArrow = ({ className, ...otherProps }: TooltipArrow.Props) => {
    return (
        <BaseTooltip.Arrow {...otherProps} render={(props, state) => <PopupArrow className={className} side={state.side} {...props} />} />
    )
}

export namespace TooltipArrow {
    export interface Props extends Omit<BaseTooltip.Arrow.Props, 'className' | 'render'> {
        className?: string
    }
}