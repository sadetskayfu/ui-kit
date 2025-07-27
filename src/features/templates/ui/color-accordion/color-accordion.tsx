import { memo, useEffect, useMemo, useState } from 'react';
import { useTemplatesStore } from '../../model/templates-store';
import { ColorPicker } from '../color-picker/color-picker';
import { Accordion } from '@/shared/ui/accordion';
import styles from './color-accordion.module.scss'

interface ColorAccordionProps {
	title: string;
	variables: string[];
}

export const ColorAccordion = memo(({ title, variables: cssVariables }: ColorAccordionProps) => {
	const activeTemplateId = useTemplatesStore(state => state.activeTemplateId)
	const variables = useTemplatesStore(state => state.templates.find((template) => template.id === activeTemplateId)?.variables || {});
	const setVariable = useTemplatesStore(state => state.setColorVariable);

	console.log(variables)

	const renderItems = () => {
		return cssVariables.map(cssVariable => {
			const color = variables[cssVariable]
			return (
				<ColorPicker
					key={cssVariable}
					cssVariable={cssVariable}
					value={color}
					onChange={color => setVariable(cssVariable, color)}
				/>
			)
		});
	}

	return <Accordion bodyClassName={styles['accordion-body']} title={title}>{renderItems()}</Accordion>;
});
