import { classNames } from '@/shared/helpers/class-names';
import { Accordion } from '@/shared/ui/accordion';
import styles from './section.module.scss';

export const Section = ({ className, contentClassName, children, title }: Section.Props) => {
	return (
		<div className={classNames(styles['section'], [className])}>
			<h2 className={styles['title']}>{title}</h2>
			<div className={classNames(styles['content'], [contentClassName])}>{children}</div>
		</div>
	);
};

export namespace Section {
	export interface Props {
		className?: string;
		contentClassName?: string;
		children?: React.ReactNode;
		title: string;
	}
}
