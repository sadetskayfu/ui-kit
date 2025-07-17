import {
	autoUpdate,
	flip,
	FloatingPortal,
	offset,
	size as floatingSize,
	useFloating,
	useInteractions,
	useTransitionStatus,
	useTypeahead,
	type Placement,
	useMergeRefs,
} from '@floating-ui/react';
import { Field, type FieldBorderPlacement, type FieldSize, type FieldVariant } from '@/shared/ui/field';
import { useSelect, type UseSelectProps } from '../model/use-select';
import { classNames, type Mods } from '@/shared/helpers/class-names';
import { applyStyles } from '@/shared/helpers/apply-styles';
import { lazy, memo, Suspense, useMemo, type ReactElement } from 'react';
import { Button } from '@/shared/ui/button';
import { mergeEventHandlers } from '@/shared/helpers/merge-event-handlers';
import styles from './select.module.scss';

const XMarkIcon = lazy(() =>
	import('@/shared/ui/icons').then(module => ({
		default: module.XMarkIcon,
	}))
);
const ArrowIcon = lazy(() =>
	import('./arrow-icon/arrow-icon').then(module => ({
		default: module.ArrowIcon,
	}))
);

type ClearButtonProps = {
	onClick: React.MouseEventHandler<HTMLElement>;
	className: string;
};

type SelectMenuProps = {
	className?: string;
	placement?: Placement;
	offset?: number;
	paddingToFlip?: number;
	paddingBlock?: number;
	paddingInline?: number;
	width?: number;
	height?: number;
};

interface SelectProps<O, M extends boolean> extends UseSelectProps<O, M> {
	className?: string
	label: string;
	placeholder?: string;
	variant?: FieldVariant
	size?: FieldSize
	borderPlacement?: FieldBorderPlacement
	hiddenLabel?: boolean
	fullWidth?: boolean;
	actionsStyle?: React.CSSProperties
	actions?: ReactElement | (ReactElement | null)[];
	menuProps?: SelectMenuProps;
	selectRef?: React.RefObject<HTMLDivElement | null>
	fieldRef?: React.RefObject<HTMLDivElement | null>
	onClick?: React.MouseEventHandler<HTMLDivElement>
	renderClearButton?: (props: ClearButtonProps) => ReactElement;
	renderArrowIcon?: (isOpen: boolean) => ReactElement;
}

const SelectComponent = <O, M extends boolean>(props: SelectProps<O, M>) => {
	const {
		className,
		label,
		placeholder,
		variant,
		size,
		borderPlacement,
		hiddenLabel,
		fullWidth,
		actionsStyle,
		actions: externalActions,
		errored,
		disabled,
		readOnly: isReadOnly,
		required,
		clearButton: withClearButton,
		menuProps = {},
		selectRef: externalSelectRef,
		fieldRef: externalFieldRef,
		onClick,
		renderClearButton,
		renderArrowIcon,
		...otherProps
	} = props;
	const {
		className: menuClassName,
		placement = 'bottom-start',
		paddingToFlip = 5,
		offset: offsetValue = 5,
		paddingBlock = 5,
		paddingInline = 5,
		height,
		width,
	} = menuProps;

	const {
		isDirty,
		isFocused,
		isOpen,
		labelId,
		selectProps,
		optionListProps,
		optionLabelsRef,
		optionListRef,
		selectRef,
		activeIndexRef,
		renderedOptions,
		renderedSelectedValue,
		setActiveOption,
		handleClear,
		handleToggle,
		setIsOpen,
	} = useSelect({
		...otherProps,
		errored,
		disabled,
		required,
		readOnly: isReadOnly,
		clearButton: withClearButton,
	});

	const { onKeyDown, ...otherSelectProps } = selectProps;
	const { style: optionListStyle, ...otherOptionListProps } = optionListProps;

	const { refs, floatingStyles, context } = useFloating({
		placement,
		open: isOpen,
		onOpenChange: setIsOpen,
		whileElementsMounted: autoUpdate,
		middleware: [
			offset(offsetValue),
			flip({ padding: paddingToFlip }),
			floatingSize({
				apply({ rects, elements, availableHeight }) {
					applyStyles(elements.floating, {
						maxWidth: width ? `${width}px` : `${rects.reference.width}px`,
					});
					applyStyles(optionListRef.current, {
						maxHeight: height
							? `${height - paddingBlock * 2}px`
							: `${availableHeight - paddingBlock * 2}px`,
					});
				},
			}),
		],
	});

	const typeahead = useTypeahead(context, {
		listRef: optionLabelsRef,
		activeIndex: activeIndexRef.current,
		onMatch: isOpen ? index => setActiveOption(index, true) : undefined,
	});

	const { getReferenceProps } = useInteractions([typeahead]);

	const { isMounted, status } = useTransitionStatus(context, {
		duration: 200,
	});

	const menuMods: Mods = {
		[styles['open']]: status === 'open',
		[styles['close']]: status === 'close',
	};

	const mods: Mods = {
		[styles['focused']]: isFocused,
		[styles['dirty']]: isDirty,
		[styles['readonly']]: isReadOnly,
	};

	const actions = useMemo(() => {
		const clearButton = withClearButton ? (
			renderClearButton ? (
				renderClearButton({ onClick: handleClear, className: styles['clear-button'] })
			) : (
				<Button
					className={styles['clear-button']}
					tabIndex={-1}
					size="xs"
					variant="clear"
					color="secondary"
					borderRadius="circular"
					onClick={handleClear}
					iconButton
				>
					<Suspense fallback={null}>
						<XMarkIcon />
					</Suspense>
				</Button>
			)
		) : null;

		const arrowIcon = renderArrowIcon ? (
			renderArrowIcon(isOpen)
		) : (
			<Suspense fallback={null}>
				<ArrowIcon isOpen={isOpen} />
			</Suspense>
		);

		if (externalActions) {
			if (Array.isArray(externalActions)) {
				return [clearButton, ...externalActions, arrowIcon];
			} else {
				return [clearButton, externalActions, arrowIcon];
			}
		}

		return [clearButton, arrowIcon];
		// renderArrowIcon, renderClearButton
		// eslint-disable-next-line
	}, [externalActions, withClearButton, isOpen, handleClear]);

	return (
		<>
			<Field
				className={className}
				fieldClassName={classNames(styles['field'], [], mods)}
				ref={useMergeRefs([refs.setReference, externalFieldRef])}
				label={label}
				labelId={labelId}
				variant={variant}
				size={size}
				borderPlacement={borderPlacement}
				hiddenLabel={hiddenLabel}
				fullWidth={fullWidth}
				disabled={disabled}
				required={required}
				focused={isFocused}
				errored={errored}
				actions={actions}
				actionsStyle={actionsStyle}
				focusTarget={selectRef}
				onClick={mergeEventHandlers([handleToggle, onClick])}
			>
				<div ref={useMergeRefs([selectRef, externalSelectRef])} {...otherSelectProps} {...getReferenceProps({ onKeyDown })}>
					{renderedSelectedValue ? (
						renderedSelectedValue
					) : placeholder ? (
						<span>{placeholder}</span>
					) : null}
				</div>
			</Field>
			<FloatingPortal>
				{isMounted && (
					<div
						className={classNames(styles['menu'], [menuClassName], menuMods)}
						ref={refs.setFloating}
						onMouseDown={event => event.preventDefault()} // Чтобы не терять фокус с селекта при клике по меню
						style={{ ...floatingStyles, paddingBlock, zIndex: 1500 }}
					>
						<ul
							className={styles['option-list']}
							ref={optionListRef}
							style={{ ...optionListStyle, paddingInline }}
							{...otherOptionListProps}
						>
							{renderedOptions}
						</ul>
					</div>
				)}
			</FloatingPortal>
		</>
	);
};

export const Select = memo(SelectComponent) as typeof SelectComponent;