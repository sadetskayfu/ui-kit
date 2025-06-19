import { useLayoutEffect } from 'react';
import {
	LOCAL_STORAGE_ACTIVE_TEMPLATE_KEY,
	LOCAL_STORAGE_TEMPLATES_KEY,
} from './constants/local-storage-keys';
import type { Template } from './template';
import { useTemplatesStore } from './templates-store';
import { nanoid } from 'nanoid';
import { getInitialVariables } from './get-initial-variables';
import { variables } from './variables';

export function useInitTemplate() {
    const { selectTemplate, setTemplates } = useTemplatesStore()

	useLayoutEffect(() => {
		const savedTemplates = JSON.parse(
			localStorage.getItem(LOCAL_STORAGE_TEMPLATES_KEY) || '[]'
		) as Template[];
		const activeTemplateId = localStorage.getItem(LOCAL_STORAGE_ACTIVE_TEMPLATE_KEY);
       
        // Если нету ниодного шаблона, создаем дефолтный
        if (savedTemplates.length === 0) {
            
            const defaultTemplate = {
                id: nanoid(),
                name: 'Default template',
                variables: getInitialVariables(variables),
            };
    
            localStorage.setItem(LOCAL_STORAGE_TEMPLATES_KEY, JSON.stringify([defaultTemplate]));
            localStorage.setItem(LOCAL_STORAGE_ACTIVE_TEMPLATE_KEY, defaultTemplate.id);

            setTemplates([defaultTemplate])
            selectTemplate(defaultTemplate.id)
        }

		// Если у нас есть шаблоны, но нету активного, устанавливаем активным последний шаблон
		if (savedTemplates.length > 0 && !activeTemplateId) {
            const lastTemplateId = savedTemplates[savedTemplates.length - 1].id

			localStorage.setItem(
				LOCAL_STORAGE_ACTIVE_TEMPLATE_KEY,
				lastTemplateId
			);
            
            setTemplates(savedTemplates)
            selectTemplate(lastTemplateId)
		}

        if(savedTemplates.length > 0 && activeTemplateId) {
            setTemplates(savedTemplates)
            selectTemplate(activeTemplateId)
        }
	}, [selectTemplate, setTemplates]);
}
