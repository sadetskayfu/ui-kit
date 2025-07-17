import {
	lazy,
	Suspense,
	useCallback,
	useId,
	useMemo,
	useRef,
	useState,
	type ReactElement,
} from 'react';
import { Button } from '@/shared/ui/button';
import styles from '../ui/text-field.module.scss';

const XMarkIcon = lazy(() =>
	import('@/shared/ui/icons').then(module => ({
		default: module.XMarkIcon,
	}))
);

type ClearButtonProps = {
	onClick: React.MouseEventHandler<HTMLElement>
	className: string;
};

export interface UseTextFieldProps {
	defaultDirty?: boolean;
	name?: string;
	labelId?: string;
	clearButton?: boolean; // Если мы хотим кнопку очистки в неконтролируемом инпуте, передаем этот пропс, если у нас инпут контролируемый, то нужно передать onClear
	actions?: (ReactElement | null)[] | ReactElement;
	renderClearButton?: (props: ClearButtonProps) => ReactElement<HTMLElement>;
	onClear?: (name: string, event: React.MouseEvent) => void;
	onFocus?: React.FocusEventHandler<HTMLInputElement>;
	onBlur?: React.FocusEventHandler<HTMLInputElement>;
	onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export function useTextField(props: UseTextFieldProps) {
	const {
		defaultDirty = false,
		name,
		labelId: externalLabelId,
		clearButton,
		actions: externalActions,
		renderClearButton,
		onClear,
		onBlur,
		onFocus,
		onChange,
	} = props;

	const [isDirty, setIsDirty] = useState<boolean>(defaultDirty);
	const [isFocused, setIsFocused] = useState<boolean>(false);

	const id = useId();
	const inputId = `${id}-input`;
	const localLabelId = `${id}-label`;
	const labelId = externalLabelId || localLabelId;

	const inputRef = useRef<HTMLInputElement>(null);

	const withClearButton = clearButton || Boolean(onClear);

	const handleClear = useCallback(
		(event: React.MouseEvent) => {
			event.stopPropagation();

			if (!withClearButton) return;

			if (onClear) {
				onClear(name || '', event);
			} else {
				if (inputRef.current) {
					inputRef.current.value = '';
				}
			}

			setIsDirty(false);
			inputRef.current?.focus()
		},
		[name, withClearButton, onClear]
	);

	const handleChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			onChange?.(event);

			// Если у нас есть кнопка очистки, следим за value на onChange, чтобы скрывать кнопку когда инпут чистый
			if (withClearButton) {
				const inputValue = event.target.value;
				setIsDirty(inputValue.length > 0);
			}
		},
		[onChange, withClearButton]
	);

	const handleFocus = useCallback(
		(event: React.FocusEvent<HTMLInputElement>) => {
			setIsFocused(true);
			onFocus?.(event);
		},
		[onFocus]
	);

	const handleBlur = useCallback(
		(event: React.FocusEvent<HTMLInputElement>) => {
			setIsFocused(false);
			onBlur?.(event);
		},
		[onBlur]
	);

	const actions = useMemo(() => {
		if (!withClearButton) return externalActions;

		const clearButton = renderClearButton ? (
			renderClearButton({ onClick: handleClear, className: styles['clear-button'] })
		) : (
			<Button
				tabIndex={-1}
				size="xs"
				variant="clear"
				color="secondary"
				borderRadius="circular"
				iconButton
				onClick={handleClear}
				className={styles['clear-button']}
			>
				<Suspense fallback={null}>
					<XMarkIcon />
				</Suspense>
			</Button>
		);

		if (Array.isArray(externalActions)) {
			return [clearButton, ...externalActions];
		}

		if (externalActions) {
			return [clearButton, externalActions];
		}

		return clearButton;
	}, [externalActions, withClearButton, handleClear, renderClearButton]);

	return {
		handleChange,
		handleBlur,
		handleFocus,
		actions,
		isFocused,
		isDirty,
		inputId,
		labelId,
		inputRef,
	};
}
