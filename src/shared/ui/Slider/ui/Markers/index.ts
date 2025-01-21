import { lazy } from 'react'

export type { CustomMarker } from './ui/Markers'
export type { MarkerLabelPosition } from './ui/Marker/Marker'

export const Markers = lazy(() => import('./ui/Markers'))
