import { autoUpdate, flip, offset, safePolygon, shift, useClick, useDelayGroup, useDismiss, useFloating, useFloatingNodeId, useFloatingParentNodeId, useFloatingTree, useHover, useInteractions,  useListNavigation, useRole, useTransitionStatus, useTypeahead, type Placement } from '@floating-ui/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTouchDevice } from '@/shared/hooks';

export interface UseMenuProps {
	placementRoot?: Placement;
	placementNested?: Placement;
	openVariant?: 'click' | 'hover';
	delay?: number | Partial<{ open: number; close: number }>;
	padding?: number; // Отступ для контента меню
	paddingToFlip?: number;
	offset?: number; // Отступ меню от тригера
    gap?: number // Отступ между меню
}

export function useMenu(props: UseMenuProps){
	const {
		placementRoot = 'bottom-start',
		placementNested = 'right-start',
		openVariant = 'click',
		delay,
		padding = 5,
		paddingToFlip = 5,
		offset: offsetValue = 5,
        gap = 10,
	} = props;

	const [isOpen, setIsOpen] = useState(false);
	const [activeIndex, setActiveIndex] = useState<number | null>(null);

	const elementsRef = useRef<Array<HTMLButtonElement | HTMLAnchorElement | null>>([]);
    const labelsRef = useRef<Array<string>>([]) // храним лейблы опций, для typehead (навигация по опциям при вводе символов)

    const { isTouchDevice } = useTouchDevice()

    const tree = useFloatingTree()
	const nodeId = useFloatingNodeId()
	const parentId = useFloatingParentNodeId()

    const isNested = parentId != null

    const data = useFloating({
		nodeId,
		open: isOpen,
		onOpenChange: setIsOpen,
		placement: isNested ? placementNested : placementRoot,
		middleware: [
			offset({
				mainAxis: isNested ? gap : offsetValue,
				alignmentAxis: isNested ? -padding : 0,
			}),
			flip({ padding: paddingToFlip }),
			shift({ padding: paddingToFlip }),
		],
		whileElementsMounted: autoUpdate,
    })

	const context = data.context
	const refs = data.refs

	const { delay: groupDelay, isInstantPhase } = useDelayGroup(context, {
		id: context.floatingId,
	});

	const hover = useHover(context, {
		enabled: !isTouchDevice && (openVariant === 'hover' || isNested),
		handleClose: safePolygon(),
		delay: isNested ? 0 : (groupDelay === 0 ? delay : groupDelay),
	})
    const click = useClick(context, {
        event: 'click',
		ignoreMouse: isNested || openVariant === 'hover',
	})
    const role = useRole(context, { role: 'menu' })
    const dismiss = useDismiss(context, { bubbles: true })
	const listNavigation = useListNavigation(context, {
		listRef: elementsRef,
		activeIndex,
		nested: isNested,
        loop: true,
		onNavigate: setActiveIndex,
	})
    const typeahead = useTypeahead(context, {
		listRef: labelsRef,
		activeIndex,
		enabled: !isTouchDevice,
        onMatch: isOpen ? setActiveIndex : undefined,
	})

	const interactions = useInteractions([
		hover,
		click,
		role,
		dismiss,
		listNavigation,
		typeahead,
	])

    const { isMounted, status } = useTransitionStatus(context, {
		duration: isInstantPhase
		? 0
		: 200,
	})

    useEffect(() => {
		if (!tree) return

		function handleTreeClick() {
			setIsOpen(false)
		}

		function onSubMenuOpen(event: { nodeId: string; parentId: string }) {
            // Закрываем текущее подменю, если открывается другое подменю, с тем же родителем
			if (event.nodeId !== nodeId && event.parentId === parentId) {
				setIsOpen(false)
			}
		}
        
		tree.events.on('click', handleTreeClick)
		tree.events.on('menuopen', onSubMenuOpen)

		return () => {
			tree.events.off('click', handleTreeClick)
			tree.events.off('menuopen', onSubMenuOpen)
		}
	}, [tree, nodeId, parentId])

    useEffect(() => {
		if (isOpen && tree) {
			tree.events.emit('menuopen', { parentId, nodeId })
		}
	}, [tree, isOpen, nodeId, parentId])

    // Возвращаем фокус на тригер, если основное меню закрывается
    useEffect(() => {
		if(!isNested && status === 'close') {
			const referenceEl = refs.reference.current as HTMLElement | null
			referenceEl?.focus()
		}
	}, [status, isNested, refs.reference])


	return useMemo(() => ({
		...data,
		...interactions,
		activeIndex,
		nodeId,
		isOpen,
		isMounted,
		isNested,
		isInstantPhase,
		status,
		padding,
		elementsRef,
		labelsRef,
	}), [data, interactions, activeIndex, nodeId, isOpen, isMounted, isNested, isInstantPhase, status, padding])
};
