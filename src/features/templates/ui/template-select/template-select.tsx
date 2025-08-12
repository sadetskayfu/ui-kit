// import { Button } from '@/shared/ui/button';
// import { useTemplatesStore } from '../../model/templates-store';
// import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
// import { memo, useMemo } from 'react';
// import { TemplateItem } from './template-item/template-item';
// import { CreateTemplateItem } from './create-template-item/create-template-item';
// import { ArrowIcon } from '@/shared/ui/icons';
// import styles from './template-select.module.scss';

// export const TemplateSelect = memo(() => {
// 	const templates = useTemplatesStore(state => state.templates);
// 	const activeTemplateId = useTemplatesStore(state => state.activeTemplateId);

// 	const activeTemplate = templates.find(template => template.id === activeTemplateId);

// 	const renderedItems = useMemo(() => {
// 		const templateNames: string[] = [];

// 		return templates.map(template => {
// 			const matches = templateNames.filter(name => name === template.name).length;

// 			templateNames.push(template.name);

// 			return (
// 				<TemplateItem
// 					key={template.id}
// 					id={template.id}
// 					name={template.name}
// 					displayName={matches > 0 ? `${template.name} (${matches})` : template.name}
// 					active={template.id === activeTemplateId}
// 					disableDelete={templates.length === 1}
// 				/>
// 			);
// 		});
// 	}, [templates, activeTemplateId]);

// 	return null

// 	// return (
// 	// 	// <Popover modal placement="bottom-start">
// 	// 	// 	<PopoverTrigger>
// 	// 	// 		<Button className={styles['popover-trigger']}>
// 	// 	// 			{activeTemplate?.name || 'Default template'}{' '}
// 	// 	// 			<ArrowIcon direction="bottom" size="xs" />
// 	// 	// 		</Button>
// 	// 	// 	</PopoverTrigger>
// 	// 	// 	<PopoverContent
// 	// 	// 		className={styles['popover']}
// 	// 	// 		contentClassName={styles['popover-content']}
// 	// 	// 	>
// 	// 	// 		<div className={styles['template-item-list']}>{renderedItems}</div>
// 	// 	// 		<div className={styles['popover-footer']}>
// 	// 	// 			<CreateTemplateItem />
// 	// 	// 		</div>
// 	// 	// 	</PopoverContent>
// 	// 	// </Popover>
// 	// )
// });
