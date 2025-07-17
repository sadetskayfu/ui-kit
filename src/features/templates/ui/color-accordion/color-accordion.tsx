import { memo, useMemo } from 'react';
import { useTemplatesStore } from '../../model/templates-store';
import { ColorPicker } from '../color-picker/color-picker';
import { Accordion } from '@/shared/ui/accordion';
import styles from './color-accordion.module.scss'

interface ColorAccordionProps {
	title: string;
	variables: string[];
}

export const ColorAccordion = memo(({ title, variables: cssVariables }: ColorAccordionProps) => {
	const variables = useTemplatesStore(state => state.templates[0]?.variables || {});
	const setVariable = useTemplatesStore(state => state.setColorVariable);

	console.log(variables)

	const renderItems = useMemo(() => {
		return cssVariables.map(cssVariable => (
			<ColorPicker
				key={cssVariable}
				cssVariable={cssVariable}
				value={variables[cssVariable] || '#b28bf5'}
				onChange={color => setVariable(cssVariable, color)}
			/>
		));
	}, [cssVariables, setVariable, variables]);

	return <Accordion bodyClassName={styles['accordion-body']} title={title}>{renderItems}</Accordion>;
});
