import { type Decorator } from '@storybook/react'
import styles from './style-decorator.module.scss'

export const StyleDecorator: Decorator = (Story) => {

	return (
		<div
			className={styles['preview-page']}
		>
			<Story />
		</div>
	)
}