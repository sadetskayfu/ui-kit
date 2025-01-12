import { useEffect, useRef } from 'react'

export const useOptions = (
	optionsListRef: React.MutableRefObject<HTMLUListElement | null>,
	isMounted: boolean
) => {
	const optionsRef = useRef<HTMLLIElement[]>([])

	useEffect(() => {
		const optionsList = optionsListRef.current

		if (!optionsList || !isMounted) return

		const updateOptions = () => {
			const options =
				optionsList.querySelectorAll<HTMLLIElement>("[role='option']")
			optionsRef.current = Array.from(options)
		}

		const observer = new MutationObserver(updateOptions)

		observer.observe(optionsList, {
			childList: true,
		})

		updateOptions()

		return () => {
			observer.disconnect()
		}
	}, [isMounted])

	return optionsRef
}
