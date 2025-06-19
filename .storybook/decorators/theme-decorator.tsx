import { type Decorator } from '@storybook/react'
import { useEffect } from 'react'

export const ThemeDecorator: Decorator = (Story, context) => {
    const theme = context.globals.theme

	useEffect(() => {
		document.body.className = theme
	}, [theme])

	return <Story />
}