import throttle from 'lodash/throttle';
import {
	Children,
	cloneElement,
	useCallback,
	useEffect,
	useId,
	useMemo,
	useRef,
	useState,
	type HTMLAttributes,
	type ReactElement,
} from 'react';
import { useOptions } from './use-options';
import { getNextEnabledIndex, scrollToItem } from '@/shared/lib/option-navigation';
import { getLastSelectedValue, getLastSelectedOption, isValueSelected } from '../helpers';
import { OptionItem, type OptionItemProps } from '@/shared/ui/option-item';
import { CircularProgress } from '@/shared/ui/circular-progress';

type OptionProps = {
	id: string;
	index: number;
	value: string;
	disabled: boolean;
	selected: boolean;
	active: boolean;
};

export interface UseSelectProps<O, M extends boolean> {
	children?: ReactElement[] | ReactElement | null; // Если мы хотим передать опции как чилдренов, чтобы отрисовать помимо самих опций, еще дополнительные, к примеру заголовки
	options: O[];
	defaultValue?: string | string[];
	value?: string | string[];
	defaultOpen?: boolean;
	open?: boolean;
	multi?: M;
	requiredValue?: boolean; // Нельзя удалить опцию, если выбрана только она
	loading?: boolean;
	readOnly?: boolean;
	disabled?: boolean;
	required?: boolean;
	errored?: boolean;
	cols?: number;
	helperText?: string | null;
	clearButton?: boolean
	onChange?: (value: M extends true ? string[] : string) => void;
	setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
	// Испольуем две фукнции, чтобы не зависеть от структуры опции, по дефолту возвращаем опцию как строку (option => option as string)
	getOptionValue?: (option: O) => string;
	getOptionLabel?: (option: O) => string;
	getOptionDisabled?: (option: O) => boolean;
	renderOption?: (option: O, props: OptionProps) => ReactElement; // Чтобы кастомизировать опции, вы можете передать эту функцию, либо передать опции как children
	renderValue?: (option: O, onDelete?: () => void) => ReactElement;
	onFocus?: React.FocusEventHandler;
	onBlur?: React.FocusEventHandler;
}

export function useSelect<O, M extends boolean>(props: UseSelectProps<O, M>) {
	const {
		children,
		options,
		defaultValue,
		value: controlledValue,
		defaultOpen = false,
		open: controlledOpen,
		multi: isMulti = false,
		requiredValue: isRequiredValue,
		loading: isLoading = false,
		disabled: isDisabled,
		required: isRequired,
		readOnly: isReadOnly,
		errored: isErrored,
		cols = 1,
		helperText,
		clearButton: withClearButton,
		onChange: controlledOnChange,
		setOpen: setControlledOpen,
		getOptionValue = option => option as string,
		getOptionLabel = option => option as string,
		getOptionDisabled,
		renderOption,
		renderValue,
		onFocus,
		onBlur,
	} = props;

	const [isDirty, setIsDirty] = useState<boolean>(false)
	const [isFocused, setIsFocused] = useState<boolean>(false);
	const [activeIndex, setActiveIndex] = useState<number>(-1);
	const activeIndexRef = useRef<number>(-1); // Будем хранить комию индекса в рефе, чтобы наши функции не пересоздавались при смене активного индекса
	const [activeOptionId, setActiveOptionId] = useState<string | undefined>(undefined);
	const [uncontrolledValue, setUncontrolledValue] = useState<string | string[]>(
		defaultValue ? defaultValue : isMulti ? [] : ''
	);
	const [uncontrolledOpen, setUncontrolledOpen] = useState<boolean>(defaultOpen);

	const selectedValue = (controlledValue as string | string[]) ?? uncontrolledValue;
	const onChange = (controlledOnChange ?? setUncontrolledValue) as (
		value: string | string[]
	) => void;
	const isOpen = controlledOpen ?? uncontrolledOpen;
	const setIsOpen = setControlledOpen ?? setUncontrolledOpen;

	const isArray = Array.isArray(selectedValue);

	const selectRef = useRef<HTMLDivElement>(null)
	const optionLabelsRef = useRef<string[]>([]); // храним лейблы опций, для typehead (навигация по опциям при вводе символов)
	const optionListRef = useRef<HTMLUListElement>(null);

	const id = useId();
	const labelId = `${id}-label`;
	const optionListId = `${id}-option-list`;
	const optionId = `${id}-option`;
	const helperTextId = `${id}-helper-text`;

	const { optionsRef, isOptionsReady } = useOptions({
		optionListRef,
		loading: isLoading,
		mounted: isOpen,
	});

	const onClose = useCallback(() => {
		setActiveOptionId(undefined);
		setIsOpen(false);
	}, [setIsOpen]);

	const onOpen = useCallback(() => {
		setIsOpen(true);
	}, [setIsOpen]);

	const handleToggle = useCallback(() => {
		if (isReadOnly) return;

		if (isOpen) {
			onClose();
		} else {
			onOpen();
		}
	}, [onOpen, onClose, isOpen, isReadOnly]);

	const handleClear = useCallback((event: React.MouseEvent) => {
		event.stopPropagation();

		selectRef.current?.focus()

		if(isArray) {
			if(isRequiredValue) {
				if(selectedValue.length > 1) {
					onChange([selectedValue[0]])
				} else {
					return
				}
			} else {
				onChange([])
			}
		} else {
			if(isRequiredValue) return

			onChange('')
		}
	}, [onChange, isArray, isRequiredValue, selectedValue])

	const onDelete = useCallback(
		(optionValue: string) => {
			if (isArray) {
				if (selectedValue.length === 1 && isRequiredValue) return;

				onChange(selectedValue.filter(v => v !== optionValue));
			} else {
				if (isRequiredValue) return;

				onChange('');
			}
		},
		[onChange, selectedValue, isRequiredValue, isArray]
	);

	const onSelect = useCallback(
		(optionValue: string) => {
			const isSelected = isValueSelected(optionValue, selectedValue);

			if (isSelected) {
				onDelete(optionValue);
			} else {
				if (isArray) {
					onChange([...selectedValue, optionValue]);
				} else {
					onChange(optionValue);
					onClose();
				}
			}
		},
		[selectedValue, isArray, onDelete, onChange, onClose]
	);

	const setActiveOption = useCallback(
		(index: number, withScroll: boolean = false) => {
			const optionList = optionListRef.current;
			const options = optionsRef.current;

			const option = options[index];

			activeIndexRef.current = index;
			setActiveIndex(index);
			setActiveOptionId(option?.getAttribute('id') || undefined);

			if (withScroll && optionList && option) {
				scrollToItem({ activeItem: option, itemList: optionList });
			}
		},
		[optionListRef, optionsRef]
	);

	const handleClick = useCallback(
		(event: React.MouseEvent) => {
			const option = (event.target as HTMLElement).closest('li') as HTMLElement | null;

			if (!option) return;

			const optionValue = option.getAttribute('data-value');

			if (optionValue) {
				onSelect(optionValue);
			}
		},
		[onSelect]
	);

	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent) => {
			if (isReadOnly) return;

			const options = optionsRef.current;
			const activeIndex = activeIndexRef.current;
			let nextIndex = activeIndex;

			switch (event.key) {
				case 'ArrowDown':
				case 'ArrowUp':
				case 'ArrowLeft':
				case 'ArrowRight':
					event.preventDefault();
					event.stopPropagation();

					if (isOpen) {
						const direction =
							event.key === 'ArrowDown' || event.key === 'ArrowRight' ? 1 : -1;
						nextIndex = getNextEnabledIndex({
							items: options,
							direction,
							currentIndex: activeIndex,
							step: event.key === 'ArrowUp' || event.key === 'ArrowDown' ? cols : 1,
						});
					} else {
						onOpen();
					}
					break;
				case 'Home':
				case 'End':
					if (isOpen) {
						event.preventDefault();
						event.stopPropagation();

						const isHome = event.key === 'Home';

						nextIndex = getNextEnabledIndex({
							items: options,
							currentIndex: isHome ? -1 : 0,
							direction: isHome ? 1 : -1,
						});
					}
					break;
				case 'Enter':
				case ' ':
					event.preventDefault();
					event.stopPropagation();
					if (isOpen && activeIndex !== -1) {
						onSelect(options[nextIndex].getAttribute('data-value')!);
					} else {
						if (isOpen) {
							onClose();
						} else {
							onOpen();
						}
					}
					break;
				case 'Escape':
					event.preventDefault();
					event.stopPropagation();
					onClose();
					break;
				case 'Backspace':
					if (isArray && selectedValue.length > 0) {
						event.preventDefault();
						onDelete(selectedValue[selectedValue.length - 1]);
					}
					break;
				default:
					break;
			}

			if (nextIndex !== activeIndex) {
				setActiveOption(nextIndex, true);
			}
		},
		[
			onSelect,
			onDelete,
			onClose,
			onOpen,
			setActiveOption,
			isReadOnly,
			isArray,
			isOpen,
			cols,
			selectedValue,
			optionsRef,
		]
	);

	const throttledMouseMove = useMemo(
		() =>
			throttle((event: React.MouseEvent) => {
				const option = (event.target as HTMLElement).closest('li') as HTMLLIElement | null;

				if (!option) return;

				const activeIndex = activeIndexRef.current;

				const dirtyOptionIndex = option.getAttribute('data-index');
				const optionIndex = dirtyOptionIndex ? Number(dirtyOptionIndex) : null;

				if (typeof optionIndex === 'number' && optionIndex !== activeIndex) {
					setActiveOption(optionIndex);
				}
			}, 10),
		[setActiveOption, activeIndexRef]
	);

	const handleMouseMove = useCallback(
		(event: React.MouseEvent) => {
			throttledMouseMove(event);
		},
		[throttledMouseMove]
	);

	const handleBlur = useCallback(
		(event: React.FocusEvent) => {
			onBlur?.(event);
			onClose();
			setIsFocused(false);
		},
		[onClose, onBlur]
	);

	const handleFocus = useCallback(
		(event: React.FocusEvent) => {
			onFocus?.(event);
			setIsFocused(true);
		},
		[onFocus]
	);

	// Управляем состоянием isDirty если у нас есть кнопка очистки
	useEffect(() => {
		if(!withClearButton) return

		if(isRequiredValue) {
			if(isArray) {
				setIsDirty(selectedValue.length > 1)
			} else {
				setIsDirty(false)
			}
		} else {
			setIsDirty(selectedValue.length > 0)
		}

	}, [isArray, selectedValue, isRequiredValue, withClearButton])

	// Устанавливаем активную опции после открытия меню
	useEffect(() => {
		if (isOpen && !isLoading && isOptionsReady) {
			const options = optionsRef.current;
			const optionList = optionListRef.current;
			const activeIndex = activeIndexRef.current;

			if (!optionList) return;

			if (selectedValue.length > 0) {
				setTimeout(() => {
					const lastSelectedValue = getLastSelectedValue(selectedValue);

					const { option, optionIndex } = getLastSelectedOption(
						options,
						lastSelectedValue
					);

					if (option) {
						setActiveOption(optionIndex, true);
					} else {
						setActiveOption(activeIndex, true);
					}
				}, 0);
			} else {
				setTimeout(() => {
					setActiveOption(activeIndex, true);
				}, 0);
			}
		}
		// eslint-disable-next-line
	}, [isOpen, isLoading, isOptionsReady]);

	// Xраним опции как объект, чтобы было проще к ним обращаться по value
	const recordOptions = useMemo(() => {
		return options.reduce(
			(keys, option) => {
				keys[getOptionValue(option)] = option;
				return keys;
			},
			{} as Record<string, O>
		);
		// getOptionValue
		// eslint-disable-next-line
	}, [options]);

	const renderedOptions = useMemo(() => {
		optionLabelsRef.current = [];

		if (isLoading) {
			return (
				<OptionItem centerContent role="none" notOption>
					<CircularProgress size='m' aria-label='Загрузка опций'/>
				</OptionItem>
			);
		}

		if (options.length === 0) {
			return (
				<OptionItem role="alert" notOption>
					Нету опций
				</OptionItem>
			);
		}

		// Если есть child options то используем их
		if (children) {
			return Children.map(children, (option, index) => {
				// Берем value из пропсов, чтобы определить, эта опция для выбора или нет
				const optionValue = (option.props as { value?: string }).value;

				// Если мы передаем опцию, не как для выбора, а как какой-то заголовок, то просто возвращаем ее
				if (!optionValue) {
					return cloneElement(option);
				}

				const optionLabel = getOptionLabel(recordOptions[optionValue]);

				const isDisabled = getOptionDisabled
					? getOptionDisabled(recordOptions[optionValue])
					: false;
				const isSelected = isValueSelected(optionValue, selectedValue);
				const isActive = index === activeIndex;

				// Добавляем label для навигации по вводу символов, если опция не disabled
				if (!isDisabled) {
					optionLabelsRef.current[index] = optionLabel;
				}

				return cloneElement(option as ReactElement<OptionItemProps>, {
					key: optionValue,
					id: `${optionId}-${index + 1}`,
					selected: isSelected,
					active: isActive,
					disabled: isDisabled,
				});
			});
		} else {
			return options.map((option, index) => {
				const optionValue = getOptionValue(option);
				const optionLabel = getOptionLabel(option);

				const isDisabled = getOptionDisabled ? getOptionDisabled(option) : false;
				const isSelected = isValueSelected(optionValue, selectedValue);
				const isActive = index === activeIndex;

				// Добавляем label для навигации по вводу символов, если опция не disabled
				if (!isDisabled) {
					optionLabelsRef.current[index] = optionLabel;
				}

				const optionProps: OptionProps = {
					id: `${optionId}-${index + 1}`,
					index,
					value: optionValue,
					selected: isSelected,
					active: isActive,
					disabled: isDisabled,
				};

				if (renderOption) {
					return renderOption(option, optionProps);
				} else {
					return (
						<OptionItem checkMark key={optionValue} {...optionProps}>
							{optionLabel}
						</OptionItem>
					);
				}
			});
		}
		// getOptionDisabled, getOptionLabel, getOptionValue, renderOption
		// eslint-disable-next-line
	}, [activeIndex, optionId, options, children, recordOptions, isLoading, selectedValue]);

	const renderedSelectedValue = useMemo(() => {
		if (selectedValue.length > 0) {
			if (isArray) {
				if (renderValue) {
					return selectedValue.map(value => {
						return renderValue(recordOptions[value], () =>
							isReadOnly ? undefined : onDelete(value)
						);
					});
				} else {
					const optionLabels = selectedValue.map(value =>
						getOptionLabel(recordOptions[value])
					);

					return <span>{optionLabels.join(', ')}</span>;
				}
			} else {
				if (renderValue) {
					return renderValue(recordOptions[selectedValue]);
				} else {
					return <span>{getOptionLabel(recordOptions[selectedValue])}</span>;
				}
			}
		}
		// getOptionLabel, renderValue
		// eslint-disable-next-line
	}, [isArray, isReadOnly, recordOptions, selectedValue, onDelete]);

	const selectProps: HTMLAttributes<HTMLElement> = {
		tabIndex: isDisabled ? -1 : 0,
		role: 'combobox',
		'aria-activedescendant': isOpen ? activeOptionId : undefined,
		'aria-labelledby': labelId,
		'aria-controls': isOpen ? optionListId : undefined,
		'aria-expanded': isOpen ? 'true' : 'false',
		'aria-haspopup': 'listbox',
		'aria-invalid': isErrored ? 'true' : 'false',
		'aria-disabled': isDisabled ? 'true' : undefined,
		'aria-required': isRequired ? 'true' : undefined,
		'aria-readonly': isReadOnly ? 'true' : undefined,
		'aria-describedby': helperText ? helperTextId : undefined,
		onFocus: handleFocus,
		onBlur: handleBlur,
		onKeyDown: handleKeyDown,
	};

	const optionListProps: HTMLAttributes<HTMLElement> = {
		id: optionListId,
		role: 'listbox',
		'aria-labelledby': labelId,
		'aria-multiselectable': isArray ? 'true' : 'false',
		onClick: handleClick,
		onMouseMove: handleMouseMove,
		style: {
			gridAutoColumns: `repeat(${cols}, 1fr)`,
		},
	};

	return {
		labelId,
		isDirty,
		isFocused,
		isOpen,
		selectProps,
		optionListProps,
		renderedOptions,
		renderedSelectedValue,
		optionListRef,
		selectRef,
		optionLabelsRef,
		activeIndexRef,
		setActiveOption,
		setIsOpen,
		handleToggle,
		handleClear,
	};
}
