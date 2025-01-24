import { lazy } from 'react'
import IconButton, {
	type IconButtonBorderRadius,
	type IconButtonColor,
} from './ui/IconButton'

export { IconButton, IconButtonBorderRadius, IconButtonColor }
export const IconButtonLazy = lazy(() => import('./ui/IconButton'))
