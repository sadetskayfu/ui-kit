import * as React from 'react'
import { classNames, type Mods } from '@/shared/helpers/class-names';
import styles from './form-helper-text.module.scss';

/**
 * Renders a `<p>` element
 */
export const FormHelperText = React.memo((props: FormHelperText.Props) => {
	const { children, id, className, error } = props;

	const mods: Mods = {
		[styles['error']]: error,
	};

	return (
		<p
			className={classNames(styles['form-helper-text'], [className], mods)}
			id={id}
			role={error ? 'alert' : undefined}
		>
			{children}
		</p>
	);
});

export namespace FormHelperText {
	export interface Props {
		children: React.ReactNode
		id?: string
		className?: string
		error?: boolean
	}
}
