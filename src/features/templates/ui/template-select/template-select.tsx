import { Button } from '@/shared/ui/button';
import { useTemplatesStore } from '../../model/templates-store';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { useState } from 'react';

export const TemplateSelect = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const { templates, activeTemplateId, selectTemplate } = useTemplatesStore();

	const activeTemplate = templates.find(template => template.id === activeTemplateId);

	const renderOptions = () => {
		return templates.map(template => (
			<button
				disabled={template.id === activeTemplateId}
				onClick={() => selectTemplate(template.id)}
				key={template.id}
			>
				{template.name}
			</button>
		));
	};

	return (
		<Popover open={isOpen} setOpen={setIsOpen}>
			<PopoverTrigger>
				<Button>{activeTemplate?.name || 'Default template'}</Button>
			</PopoverTrigger>
			<PopoverContent>
				<div>{renderOptions()}</div>
			</PopoverContent>
		</Popover>
	);
};
