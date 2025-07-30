import { BorderRadius, BorderRadiusPlacement } from "./border-context";
import styles from './border.module.scss'

export function getBorderClassName(borderRadius?: BorderRadius, borderRadiusPlacement?: BorderRadiusPlacement) {
    if (!borderRadius && !borderRadiusPlacement) {
        return undefined
    }

    let borderClassName = styles['border-provider']

    if (borderRadius) {
        borderClassName = borderClassName + ' ' + styles[`border-radius-${borderRadius}`]
    }

    if (borderRadiusPlacement && borderRadius !== 'none') {
        let className

        if (Array.isArray(borderRadiusPlacement)) {
            className = (borderRadiusPlacement as string[]).reduce((acc, value) => {
                return acc + ' ' + styles[`border-radius-placement-${value}`]
            }, '')
        } else {
            className = styles[`border-radius-placement-${borderRadiusPlacement}`]
        }

        borderClassName = borderClassName + ' ' + className.trimStart()
    }

    return borderClassName
}