import { ReactNode, useEffect, useRef } from 'react'
import { classNames } from '@/shared/helpers/classNames'
import { CSSTransition } from 'react-transition-group'
import styles from './style.module.scss'

interface CollapseProps {
	className?: string
	children: ReactNode
	bodyId: string
	headerId: string
	isOpen: boolean
	isLazy?: boolean
	isUnmount?: boolean
}

export const Collapse = (props: CollapseProps) => {
	const { className, bodyId, headerId, isOpen, isLazy, isUnmount, children } =
		props

	const isMountedRef = useRef<boolean>(false)
	const bodyRef = useRef<HTMLDivElement>(null)
	const autoHeighTimeoutIdRef = useRef<NodeJS.Timeout | null>(null)
	const closeTimeoutIdRef = useRef<NodeJS.Timeout | null>(null)

	// Open
	useEffect(() => {
		const body = bodyRef.current

		if (!body || !isOpen) return

		if (closeTimeoutIdRef.current) {
			clearTimeout(closeTimeoutIdRef.current)
		}

		const contentHeight = body.scrollHeight

		body.style.height = contentHeight + 'px'

		autoHeighTimeoutIdRef.current = setTimeout(() => {
			body.style.height = 'auto'
		}, 300)
	}, [isOpen])

	// Close
	useEffect(() => {
		const body = bodyRef.current

		if (!body || isOpen || !isMountedRef.current) return

		const contentHeight = body.scrollHeight

		if (autoHeighTimeoutIdRef.current) {
			clearTimeout(autoHeighTimeoutIdRef.current)
		}

		body.style.height = contentHeight + 'px'

		closeTimeoutIdRef.current = setTimeout(() => {
			body.style.height = '0px'
		}, 50)
	}, [isOpen])

	useEffect(() => {
		return () => {
			if (autoHeighTimeoutIdRef.current) {
				clearTimeout(autoHeighTimeoutIdRef.current)
			}
			if (closeTimeoutIdRef.current) {
				clearTimeout(closeTimeoutIdRef.current)
			}
		}
	}, [])

	useEffect(() => {
		isMountedRef.current = true
	}, [])

	const mods: Record<string, boolean | undefined> = {
		[styles['open']]: isOpen,
	}

	return (
		<CSSTransition
			nodeRef={bodyRef}
			in={isOpen}
			timeout={350}
			mountOnEnter={isLazy}
			unmountOnExit={isUnmount}
		>
			<div
				className={classNames(styles['body'], [className], mods)}
				ref={bodyRef}
				aria-hidden={isOpen ? undefined : 'true'}
				aria-labelledby={headerId}
				role="region"
				id={bodyId}
			>
				{children}
			</div>
		</CSSTransition>
	)
}
