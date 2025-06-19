import { useState } from 'react';
import { Collapse, CollapseContent, CollapseTrigger, type CollapseProps } from '../collapse';
import { AccordionIcon } from './accordion-icon';
import { classNames, type AdditionalClasses } from '@/shared/helpers/class-names';
import styles from './accordion.module.scss';

type AccordionVariant = 'filled' | 'outlined';

export interface AccordionProps extends Omit<CollapseProps, 'labelId' | 'bodyId' | 'referenceRef'> {
	className?: string;
	bodyClassName?: string
	title: string;
	variant?: AccordionVariant;
	onClick?: React.MouseEventHandler<HTMLElement>;
	getIcon?: (isOpen: boolean) => React.ReactElement;
}

export const Accordion = (props: AccordionProps) => {
	const {
		className,
		bodyClassName,
		title,
		children,
		variant = 'filled',
		initialOpen: isInitialOpen = false,
		open: controlledOpen,
		setOpen: setControlledOpen,
		onClick,
		getIcon,
		...collapseProps
	} = props;

	const [uncontrolledOpen, setUncontrolledOpen] = useState<boolean>(isInitialOpen);

	const isOpen = controlledOpen ?? uncontrolledOpen;
	const setIsOpen = setControlledOpen ?? setUncontrolledOpen;

	const additionalClasses: AdditionalClasses = [className, styles[`variant-${variant}`]];

	return (
		<div className={classNames(styles['accordion'], additionalClasses)}>
			<Collapse open={isOpen} setOpen={setIsOpen} {...collapseProps}>
				<CollapseTrigger>
					<button onClick={onClick} className={styles['header']}>
						{title}
						{getIcon ? getIcon(isOpen) : <AccordionIcon open={isOpen} />}
					</button>
				</CollapseTrigger>
				<CollapseContent>
					<div className={classNames(styles['body'], [bodyClassName])}>{children}</div>
				</CollapseContent>
			</Collapse>
		</div>
	);
};
