import { lazy } from 'react'
import Indicator, { type IndicatorPosition } from './ui/Indicator'

export const IndicatorLazy = lazy(() => import('./ui/Indicator'))
export { Indicator, IndicatorPosition }
