import type { Preview } from '@storybook/react'
import { Theme } from '@/app/providers/theme-provider';
import { ThemeDecorator, StyleDecorator } from './decorators';
import '@/app/styles/main.scss'

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
  decorators: [ThemeDecorator, StyleDecorator],
};

export default preview;


