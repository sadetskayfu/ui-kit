import type { Preview } from '@storybook/react'
import '@/app/styles/main.scss'
import { RouterDecorator } from '@/shared/storybook/decorators/RouterDecorator'
import { ThemeDecorator } from '@/shared/storybook/decorators/ThemeDecorator'
import { Theme } from '@/app/providers/theme'
import { StyleDecorator } from '@/shared/storybook/decorators/StyleDecorator/StyleDecorator'

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
	},
	globalTypes: {
		theme: {
			name: 'Theme',
			description: 'Global theme for components',
			defaultValue: Theme.DARK,
			toolbar: {
				icon: "circlehollow",
				items: [Theme.LIGHT, Theme.DARK],
				showName: true,
			}
		}
	},
	decorators: [RouterDecorator, ThemeDecorator, StyleDecorator],
}

export default preview
