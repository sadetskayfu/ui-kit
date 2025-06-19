import type { ColorResult } from 'react-color';
import { create } from 'zustand';
import { getColorName, getPercentage, isMediumColor } from './helpers';
import {
	LOCAL_STORAGE_TEMPLATES_KEY,
	LOCAL_STORAGE_ACTIVE_TEMPLATE_KEY,
} from './constants/local-storage-keys';
import { nanoid } from 'nanoid';
import type { Template } from './template';

type TemplatesState = {
	templates: Template[];
	activeTemplateId: string;
	setTemplates: (templates: Template[]) => void;
	selectTemplate: (id: string) => void;
	createTemplate: (name: string) => void;
	renameTemplate: (id: string, name: string) => void;
	deleteTemplate: (id: string) => void;
	setVariable: (variable: string, value: string) => void;
	setColorVariable: (variable: string, color: ColorResult) => void;
	getCssVariables: () => string;
};

function setVariables(variables: Record<string, string>) {
	Object.entries(variables).forEach(([variable, value]) => {
		document.documentElement.style.setProperty(variable, value);
	});
}

export const useTemplatesStore = create<TemplatesState>((set, get) => {
	return {
		templates: [],
		activeTemplateId: '',
		setTemplates: (templates) => {
			set({templates})
		},
		createTemplate: name => {
			set(state => {
				const prevTemplate = state.templates.find(
					template => template.id === state.activeTemplateId
				);
				const prevTemplateVariables = prevTemplate!.variables;

				const newTemplate: Template = {
					id: nanoid(),
					name,
					variables: { ...prevTemplateVariables },
				};

				const updatedTemplates = [...state.templates, newTemplate];

				localStorage.setItem(LOCAL_STORAGE_TEMPLATES_KEY, JSON.stringify(updatedTemplates));
				localStorage.setItem(LOCAL_STORAGE_ACTIVE_TEMPLATE_KEY, newTemplate.id);

				return {
					templates: updatedTemplates,
					activeTemplateId: newTemplate.id,
				};
			});
		},
		deleteTemplate: id => {
			set(state => {
				// Если у нас всего 1 шаблон, то не удаляем
				if (state.templates.length <= 1) {
					return {};
				}

				const deletedTemplate = state.templates.find(template => template.id === id);

				if (!deletedTemplate) {
					return {};
				}

				const updatedTemplates = state.templates.filter(template => template.id !== id);

				// Если мы удаляем активный шаблон
				if (state.activeTemplateId === id) {
					const newActiveTemplate = updatedTemplates[updatedTemplates.length - 1];

					localStorage.setItem(LOCAL_STORAGE_ACTIVE_TEMPLATE_KEY, newActiveTemplate.id);
					localStorage.setItem(
						LOCAL_STORAGE_TEMPLATES_KEY,
						JSON.stringify(updatedTemplates)
					);

					setVariables(newActiveTemplate.variables);

					return {
						templates: updatedTemplates,
						activeTemplateId: newActiveTemplate.id,
					};
				}

				localStorage.setItem(LOCAL_STORAGE_TEMPLATES_KEY, JSON.stringify(updatedTemplates));

				return {
					templates: updatedTemplates,
				};
			});
		},
		renameTemplate: (id, name) => {
			set(state => {
				const template = state.templates.find(template => template.id === id);

				if (!template) {
					return {};
				}

				// Если название шаблона такое же как и было, то ничего не делаем
				if (template.name === name) {
					return {};
				}

				const updatedTemplates = state.templates.map(template => {
					if (template.id === id) {
						return { ...template, name };
					}
					return template;
				});

				localStorage.setItem(LOCAL_STORAGE_TEMPLATES_KEY, JSON.stringify(updatedTemplates));

				return {
					templates: updatedTemplates,
				};
			});
		},
		selectTemplate: id => {
			set(state => {
				if (state.activeTemplateId === id) {
					return {};
				}

				const newActiveTemplate = state.templates.find(template => template.id === id);

				if (!newActiveTemplate) {
					return {};
				}

				localStorage.setItem(LOCAL_STORAGE_ACTIVE_TEMPLATE_KEY, newActiveTemplate.id);

				setVariables(newActiveTemplate.variables);

				return {
					activeTemplateId: id,
				};
			});
		},
		setVariable: (variable, value) => {
			set(state => {
				let activeTemplate: Template = {
					id: '',
					name: '',
					variables: {},
				};
				const otherTemplates: Template[] = [];

				state.templates.forEach(template => {
					if (template.id === state.activeTemplateId) {
						activeTemplate = template;
					} else {
						otherTemplates.push(template);
					}
				});

				const updatedTemplates: Template[] = [
					...otherTemplates,
					{
						...activeTemplate,
						variables: { ...activeTemplate.variables, [variable]: value },
					},
				];

				localStorage.setItem(LOCAL_STORAGE_TEMPLATES_KEY, JSON.stringify(updatedTemplates));

				document.documentElement.style.setProperty(variable, value);

				return {
					templates: updatedTemplates,
				};
			});
		},
		setColorVariable: (variable, color) => {
			set(state => {
				let activeTemplate: Template = {
					id: '',
					name: '',
					variables: {},
				};
				const otherTemplates: Template[] = [];

				state.templates.forEach(template => {
					if (template.id === state.activeTemplateId) {
						activeTemplate = template;
					} else {
						otherTemplates.push(template);
					}
				});

				let newColorVariables: Record<string, string> = {};

				// Для центрального цвета мы создаем доп. переменные
				if (isMediumColor(variable)) {
					const colorName = getColorName(variable);

					if (!colorName) return {};

					const hue = Math.ceil(color.hsl.h).toString();
					const saturation = getPercentage(color.hsl.s);
					const lightness = getPercentage(color.hsl.l);

					const hueVariable = `--${colorName}-hue`;
					const saturationVariable = `--${colorName}-saturation`;
					const lightnessVariable = `--${colorName}-lightness`;

					document.documentElement.style.setProperty(variable, color.hex);
					document.documentElement.style.setProperty(hueVariable, hue);
					document.documentElement.style.setProperty(saturationVariable, saturation);
					document.documentElement.style.setProperty(lightnessVariable, lightness);

					newColorVariables = {
						[variable]: color.hex,
						[hueVariable]: hue,
						[saturationVariable]: saturation,
						[lightnessVariable]: lightness,
					};
				} else {
					document.documentElement.style.setProperty(variable, color.hex);

					newColorVariables = {
						[variable]: color.hex,
					};
				}

				const updatedTemplates: Template[] = [
					...otherTemplates,
					{
						...activeTemplate,
						variables: { ...activeTemplate.variables, ...newColorVariables },
					},
				];

				localStorage.setItem(LOCAL_STORAGE_TEMPLATES_KEY, JSON.stringify(updatedTemplates));

				return {
					templates: updatedTemplates,
				};
			});
		},
		getCssVariables: () => {
			const vars = get().templates.find(
				template => template.id === get().activeTemplateId
			)!.variables;
			return Object.entries(vars)
				.map(([variable, value]) => `${variable}: ${value}`)
				.join('\n');
		},
	};
});
