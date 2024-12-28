import { ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface PortalProps {
	children: ReactNode
	portalTarget?: HTMLElement | null
}

export const Portal = (props: PortalProps) => {

	const { children, portalTarget } = props

	if(portalTarget) {
		return createPortal(children, portalTarget)
	} 
	
	return createPortal(children, document.querySelector('body')!)
}
