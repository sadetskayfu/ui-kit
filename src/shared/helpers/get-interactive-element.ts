import { getTarget } from "@floating-ui/react/utils";

export function getInteractiveElement(event: Event, additional?: string) {
    const target = getTarget(event);

    const interactiveElement =
        target instanceof Element
            ? target.closest(
                    `button,a,input,textarea,[role="button"]` + (additional ? `,${additional}` : '')
                )
            : null

    return interactiveElement
}