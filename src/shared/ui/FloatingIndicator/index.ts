import { lazy } from 'react'
import FloatingIndicator, {
	type FloatingIndicatorPosition,
} from './ui/FloatingIndicator'

export { FloatingIndicator, FloatingIndicatorPosition }
export const FloatingIndicatorLazy = lazy(
	() => import('./ui/FloatingIndicator')
)
