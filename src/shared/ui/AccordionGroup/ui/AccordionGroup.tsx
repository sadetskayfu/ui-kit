import { AccordionProps } from '@/shared/ui/Accordion'
import { Children, cloneElement, ReactElement, useState } from 'react'

interface AccordionGroupProps {
	children: ReactElement<AccordionProps>[],
    initialValue?: string
}

export const AccordionGroup = (props: AccordionGroupProps) => {
	const { children, initialValue = ''} = props

	const [activeValue, setActiveValue] = useState<string>(initialValue)

	const handleChange = (value: string) => {
		const newValue = value === activeValue ? '' : value
		setActiveValue(newValue)
	}

	return (
		<>
			{Children.map(children, (accordion, index) => {
				const value = index + 1 + ''

				return cloneElement(accordion, {
					isOpen: value === activeValue,
					onChange: () => handleChange(value),
				})
			})}
		</>
	)
}
