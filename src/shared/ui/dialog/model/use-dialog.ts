import {
	useFloating,
	useClick,
	useDismiss,
	useRole,
	useInteractions,
} from '@floating-ui/react'
import { useMemo, useState } from 'react'

export interface UseDialogProps {
	initialOpen?: boolean
	initialFocus?: number | React.RefObject<HTMLElement | null>; // By default on the content body
	returnFocus?: boolean | React.RefObject<HTMLElement | null>; // By default on reference element
    portalTargetRef?: React.RefObject<HTMLElement | null>;
    removeScroll?: boolean
	disableDefaultClick?: boolean
	open?: boolean
	setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useDialog = (props: UseDialogProps) => {
	const {
		initialOpen = false,
		initialFocus,
		returnFocus = true,
        portalTargetRef,
        removeScroll = true,
		disableDefaultClick,
		open: controlledOpen,
		setOpen: setControlledOpen,
	} = props

	const [uncontrolledOpen, setUncontrolledOpen] = useState<boolean>(initialOpen)
	const [labelId, setLabelId] = useState<string | undefined>()
	const [descriptionId, setDescriptionId] = useState<string | undefined>()

	const open = controlledOpen ?? uncontrolledOpen
	const setOpen = setControlledOpen ?? setUncontrolledOpen

	const data = useFloating({
		open,
		onOpenChange: setOpen,
	})

	const context = data.context

	const click = useClick(context, {
		enabled: !disableDefaultClick,
	})
	const dismiss = useDismiss(context)
	const role = useRole(context, { role: 'dialog' })

	const interactions = useInteractions([click, dismiss, role])

	return useMemo(
		() => ({
			open,
			setOpen,
			...interactions,
			...data,
			initialFocus,
			returnFocus,
            portalTargetRef,
            removeScroll,
			labelId,
			descriptionId,
			setLabelId,
			setDescriptionId,
		}),
		[
			open,
			setOpen,
			interactions,
			data,
			initialFocus,
			returnFocus,
            portalTargetRef,
            removeScroll,
			labelId,
			descriptionId,
		]
	)
}