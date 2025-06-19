import { LOCAL_STORAGE_ACTIVE_TEMPLATE_KEY, LOCAL_STORAGE_TEMPLATES_KEY } from "./constants/local-storage-keys";
import type { Template } from "./template";

export function getInitialVariables(variables: string[]) {
	const computedStyles = getComputedStyle(document.documentElement);
	const initialVariables: Record<string, string> = {};

	const templates = JSON.parse(
		localStorage.getItem(LOCAL_STORAGE_TEMPLATES_KEY) || '[]'
	) as Template[];

	let localStorageVariables: Record<string, string> = {};

	// Если есть шаблоны в localStorage, то берем значение переменных оттуда
	if (templates.length > 0) {
		const activeTemplateId =
			localStorage.getItem(LOCAL_STORAGE_ACTIVE_TEMPLATE_KEY) ||
			templates[templates.length - 1].id;
		const activeTemplate = templates.find(template => template.id === activeTemplateId);

		if (activeTemplate) {
			localStorageVariables = activeTemplate.variables;
		}
	}

	variables.forEach(variable => {
		const variableValue =
			localStorageVariables[variable] ||
			computedStyles.getPropertyValue(variable).trim() ||
			'';

		initialVariables[variable] = variableValue;
	});

	return initialVariables;
}