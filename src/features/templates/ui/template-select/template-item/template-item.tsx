import { Button, ButtonProvider } from '@/shared/ui/button';
import {
	ListItemButton,
	ListItemContent,
	type ListItemRenderActionsProps,
} from '@/shared/ui/list-item';
import { BaseTooltip } from '@/shared/ui/tooltip';
import { memo, useCallback, useMemo, useRef, useState } from 'react';
import { useTemplatesStore } from '@/features/templates/model/templates-store';
import { TextField } from '@/shared/ui/text-field';
import { EditIcon, MoreIcon, SaveIcon, TrashIcon, XMarkIcon } from '@/shared/ui/icons';
import { ConfirmDialog } from '@/shared/ui/dialog/ui';
import { validateTemplateName } from '@/features/templates/model/helpers';
import { capitalizeFirstLetter, collapseSpaces } from '@/shared/lib/strings';
import { Menu, MenuItem } from '@/shared/ui/menu';
import { classNames } from '@/shared/helpers/class-names';
import styles from './template-item.module.scss';

interface TemplateItemProps {
	id: string;
	name: string;
	displayName: string;
	active: boolean;
	disableDelete?: boolean;
}

export const TemplateItem = memo(
	({ id, name, displayName, active, disableDelete }: TemplateItemProps) => {
		const [isRename, setIsRename] = useState<boolean>(false);
		const [inputError, setInputError] = useState<string | undefined>(undefined);
		const [inputValue, setInputValue] = useState<string>(name);
		const [isValidInputValue, setIsValidInputValue] = useState<boolean>(true);

		const inputValueRef = useRef<string>(name);
		const inputRef = useRef<HTMLInputElement>(null);
		const actionMenuButtonRef = useRef<HTMLButtonElement>(null);

		const onRename = useTemplatesStore(state => state.renameTemplate);
		const onDelete = useTemplatesStore(state => state.deleteTemplate);
		const onSelect = useTemplatesStore(state => state.selectTemplate);

		const setDefaultInputState = useCallback((value: string) => {
			inputValueRef.current = value;

			setInputValue(value);
			setIsValidInputValue(true);
			setInputError(undefined);
		}, []);

		const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
			const value = event.target.value;

			const error = validateTemplateName(value.trim());

			setIsValidInputValue(!error);
			setInputError(error);

			setInputValue(value);
			inputValueRef.current = value;
		}, []);

		const startRename = useCallback(() => {
			setIsRename(true);

			setTimeout(() => {
				inputRef.current?.focus();
			}, 0);
		}, []);

		const cancelRename = useCallback(() => {
			setIsRename(false);
			setDefaultInputState(name);

			setTimeout(() => {
				actionMenuButtonRef.current?.focus();
			}, 0);
		}, [name, setDefaultInputState]);

		const finishRename = useCallback(() => {
			const value = inputValueRef.current;

			const correctedValue = capitalizeFirstLetter(
				collapseSpaces(value.trim().toLowerCase())
			);

			onRename(id, correctedValue);
			setIsRename(false);

			setDefaultInputState(correctedValue);

			setTimeout(() => {
				actionMenuButtonRef.current?.focus();
			}, 0);
		}, [id, onRename, setDefaultInputState]);

		const handleSelect = useCallback(() => {
			onSelect(id);
		}, [onSelect, id]);

		const handleDelete = useCallback(() => {
			onDelete(id);
		}, [onDelete, id]);

		const handleKeyDown = useCallback(
			(event: React.KeyboardEvent<HTMLInputElement>) => {
				switch (event.key) {
					case 'Escape':
						event.stopPropagation();
						cancelRename();
						break;
					case 'Enter':
						if (isValidInputValue) {
							finishRename();
						}
						break;
					default:
						break;
				}
			},
			[isValidInputValue, cancelRename, finishRename]
		);

		const fieldActions = useMemo(() => {
			return (
				<>
					<ButtonProvider
						variant="clear"
						borderRadius="circular"
						color="secondary"
						size="s"
						iconButton
					>
						<BaseTooltip label={`Отменить изменение`}>
							<Button aria-label={`Отменить изменение`} onClick={cancelRename}>
								<XMarkIcon />
							</Button>
						</BaseTooltip>
						<BaseTooltip label={`Сохранить изменение`}>
							<Button
								aria-label={`Сохранить изменение`}
								onClick={finishRename}
								disabled={!isValidInputValue}
							>
								<SaveIcon />
							</Button>
						</BaseTooltip>
					</ButtonProvider>
				</>
			);
		}, [isValidInputValue, finishRename, cancelRename]);

		const renderListItemActions = useCallback((props: ListItemRenderActionsProps) => {
			return (
				<div
					className={classNames(props.className, [styles['list-item-actions']])}
					{...props.handlers}
				>
					<Menu
						placementRoot="right"
						triggerRef={actionMenuButtonRef}
						renderTrigger={props => (
							<Button
								{...props}
								aria-label="Меню действий"
								className={styles['option-button']}
								size="s"
								variant="clear"
								color="secondary"
								borderRadius="circular"
								iconButton
							>
								<MoreIcon />
							</Button>
						)}
					>
						<MenuItem
							renderEndIcon={props => <EditIcon {...props} />}
							onClick={startRename}
							title="Изменить название"
						/>
						<ConfirmDialog
							title="Удаление шаблона"
							description={`Вы уверены, что хотите удалить шаблон "${displayName}"?`}
							onConfirm={handleDelete}
							closeAfterConfirm
						>
							<MenuItem
								disabled={disableDelete}
								disableCloseAfterClick
								renderEndIcon={props => <TrashIcon {...props} />}
								title="Удалить"
							/>
						</ConfirmDialog>
					</Menu>
				</div>
			);
		}, [disableDelete, displayName, handleDelete, startRename]);

		return (
			<>
				{isRename ? (
					<TextField
						inputRef={inputRef}
						label="Название шаблона"
						value={inputValue}
						placeholder="Введите название шаблона"
						helperText={inputError}
						errored={!!inputError}
						hiddenLabel
						fullWidth
						variant="filled"
						size="m"
						onChange={handleChange}
						onKeyDown={handleKeyDown}
						actions={fieldActions}
					/>
				) : (
					<ListItemButton
						aria-label={
							active ? undefined : `Установить шаблон ${displayName} активным`
						}
						pressed={active}
						borderRadius="m"
						onClick={active ? undefined : handleSelect}
						style={{ cursor: active ? 'default' : 'pointer' }}
					>
						<ListItemContent
							className={styles['template-list-item-content']}
							title={displayName}
							renderActions={renderListItemActions}
						/>
					</ListItemButton>
				)}
			</>
		);
	}
);
