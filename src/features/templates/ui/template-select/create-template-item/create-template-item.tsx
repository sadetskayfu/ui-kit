import { validateTemplateName } from '../../../model/helpers/validate-template-name';
import { useTemplatesStore } from '../../../model/templates-store';
import { Button, ButtonVariantProvider } from '@/shared/ui/button';
import { memo, useCallback, useMemo, useRef, useState } from 'react';
import { CheckMarkIcon, XMarkIcon } from '@/shared/ui/icons';
import { TextField } from '@/shared/ui/text-field';
import { BaseTooltip } from '@/shared/ui/tooltip';
import { capitalizeFirstLetter, collapseSpaces } from '@/shared/lib/strings';

export const CreateTemplateItem = memo(() => {
	const [isCreate, setIsCreate] = useState<boolean>(false);
	const [inputValue, setInputValue] = useState<string>('');
	const [inputError, setInputError] = useState<string | undefined>();
	const [isValidInputValue, setIsValidInputValue] = useState<boolean>(false);

	const buttonRef = useRef<HTMLButtonElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const inputValueRef = useRef<string>(inputValue);

	const onCreate = useTemplatesStore(state => state.createTemplate);

	const clearInputState = useCallback(() => {
		inputValueRef.current = ''
		setInputValue('');
		setInputError(undefined);
		setIsValidInputValue(false);
	}, []);

	const startCreate = useCallback(() => {
		setIsCreate(true);

		setTimeout(() => {
			inputRef.current?.focus();
		});
	}, []);

	const cancelCreate = useCallback(() => {
		setIsCreate(false);
		clearInputState();

		setTimeout(() => {
			buttonRef.current?.focus();
		}, 0);
	}, [clearInputState]);

	const finishCreate = useCallback(() => {
		const value = inputValueRef.current

		onCreate(capitalizeFirstLetter(collapseSpaces(value.trim().toLowerCase())));
		setIsCreate(false);
		clearInputState();

		setTimeout(() => {
			buttonRef.current?.focus();
		}, 0);
	}, [clearInputState, onCreate]);

	const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;

		const error = validateTemplateName(value.trim())

		setIsValidInputValue(!error)
		setInputError(error);

		inputValueRef.current = value;
		setInputValue(value);
	}, []);

	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent<HTMLInputElement>) => {
			switch (event.key) {
				case 'Escape':
					event.stopPropagation();
					cancelCreate();
					break;
				case 'Enter':
					if (isValidInputValue) {
						finishCreate();
					}
					break;
				default:
					break;
			}
		},
		[isValidInputValue, cancelCreate, finishCreate]
	);

	const actions = useMemo(() => {
		return (
			<ButtonVariantProvider
				iconButton
				variant="clear"
				size="s"
				color="secondary"
			>
				<BaseTooltip label={`Отменить создание шаблона`}>
					<Button
						aria-label="Отменить создание шаблона"
						tabIndex={-1}
						onClick={cancelCreate}
					>
						<XMarkIcon />
					</Button>
				</BaseTooltip>
				<BaseTooltip label={`Создать шаблон`}>
					<Button
						aria-label={`Создать шаблон`}
						tabIndex={-1}
						disabled={!isValidInputValue}
						onClick={finishCreate}
					>
						<CheckMarkIcon variant="clear" />
					</Button>
				</BaseTooltip>
			</ButtonVariantProvider>
		);
	}, [isValidInputValue, cancelCreate, finishCreate]);

	return (
		<>
			{isCreate ? (
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
					actions={actions}
				/>
			) : (
				<Button ref={buttonRef} fullWidth onClick={startCreate}>
					Добавить шаблон
				</Button>
			)}
		</>
	);
});
