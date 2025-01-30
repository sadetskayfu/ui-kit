import { useEffect, useRef } from 'react'

type UseRefValuesArgs = {
	selectedValue: string | string[]
	isOpen: boolean
	isMountedMenu: boolean
}

export const useRefValues = (args: UseRefValuesArgs) => {
	const { selectedValue, isOpen, isMountedMenu } = args

	const selectedValueRef = useRef<string | string[]>(selectedValue)
	const isOpenRef = useRef<boolean>(isOpen)
	const isMountedMenuRef = useRef<boolean>(isOpen)

	useEffect(() => {
		selectedValueRef.current = selectedValue
	}, [selectedValue])

	useEffect(() => {
		isOpenRef.current = isOpen
	}, [isOpen])

	useEffect(() => {
		isMountedMenuRef.current = isMountedMenu
	}, [isMountedMenu])

	return { selectedValueRef, isOpenRef, isMountedMenuRef }
}
