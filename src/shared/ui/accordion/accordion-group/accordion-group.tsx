import { Children, cloneElement, useCallback, useState } from 'react';
import type { AccordionProps } from '../accordion';
import { AccordionGroupContext } from './accordion-group-context';

interface AccordionGroupProps {
	className?: string;
	children: React.ReactElement<AccordionProps>[];
	initialOpen?: string;
	style?: React.CSSProperties
}

export const AccordionGroup = ({ className, children, initialOpen = '', style }: AccordionGroupProps) => {
	const [openedAccordion, setOpenedAccordion] = useState<string>(initialOpen);

	const handleOpen = useCallback(
		(value: string) => {
			if (value === openedAccordion) {
				setOpenedAccordion('');
			} else {
				setOpenedAccordion(value);
			}
		},
		[openedAccordion]
	);

	const handleClose = useCallback(() => {
		setOpenedAccordion('');
	}, []);

	const renderAccordions = Children.map(children, (child, index) => {
		const value = String(index + 1);

		return cloneElement(child, {
			open: value === openedAccordion,
			onClick: () => handleOpen(value),
		});
	});

	return (
		<div className={className} style={style}>
			<AccordionGroupContext.Provider value={{ onClose: handleClose }}>
				{renderAccordions}
			</AccordionGroupContext.Provider>
		</div>
	);
};
