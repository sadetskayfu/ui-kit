import { classNames, type Mods } from '@/shared/helpers/class-names';
import { memo } from 'react';
import styles from './form-helper-text.module.scss';

interface FormHelperTextProps {
	children: string;
	id?: string;
	className?: string;
	errored?: boolean;
}

export const FormHelperText = memo((props: FormHelperTextProps) => {
	const { children, id, className, errored: isErrored } = props;

	const mods: Mods = {
		[styles['errored']]: isErrored,
	};

	return (
		<span
			className={classNames(styles['form-helper-text'], [className], mods)}
			id={id}
			role={isErrored ? 'alert' : undefined}
		>
			{children}
		</span>
	);
});
