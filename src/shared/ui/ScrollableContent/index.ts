import { lazy } from 'react'
import ScrollableContent from './ui/ScrollableContent'

export const ScrollableContentLazy = lazy(
	() => import('./ui/ScrollableContent')
)
export { ScrollableContent }
