import { type AdditionalClasses, classNames, type Mods } from '@/shared/helpers/class-names';
import {
	type ForwardedRef,
	type HTMLAttributes,
	type ReactElement,
	type ReactNode,
	cloneElement,
	forwardRef,
	Fragment,
	useCallback,
	useId,
	useMemo,
	useRef,
} from 'react';
import { FormLabel } from '@/shared/ui/form-label';
import { useMergeRefs } from '@floating-ui/react';
import { FormHelperText } from '../form-helper-text';
import styles from './field.module.scss';

export type FieldVariant = 'filled' | 'outlined' | 'standard';
export type FieldSize = 'm' | 'l';
export type FieldBorderPlacement = 'left' | 'right' | 'all';

interface FieldProps {
	children: ReactElement<HTMLAttributes<HTMLElement>>;
	label: string;
	labelId: string;
	inputId?: string;
	className?: string;
	fieldClassName?: string;
	variant?: FieldVariant;
	size?: FieldSize;
	borderPlacement?: FieldBorderPlacement;
	hiddenLabel?: boolean;
	focused?: boolean;
	errored?: boolean;
	actions?: (ReactElement | null)[] | ReactElement;
	startAdornment?: ReactNode;
	helperText?: string | null;
	focusTarget?: React.RefObject<HTMLElement | null>;
	disabled?: boolean;
	required?: boolean;
	fullWidth?: boolean;
	actionsStyle?: React.CSSProperties
}

export type HTMLFieldProps = Omit<HTMLAttributes<HTMLElement>, keyof FieldProps>;

export const Field = forwardRef(
	(props: FieldProps & HTMLFieldProps, ref: ForwardedRef<HTMLDivElement>) => {
		const {
			children,
			label,
			labelId,
			inputId,
			className,
			fieldClassName,
			variant = 'outlined',
			size = 'm',
			borderPlacement = 'all',
			actions,
			startAdornment,
			helperText,
			focusTarget: focusTargetRef,
			hiddenLabel: isHiddenLabel,
			focused: isFocused,
			errored: isErrored,
			disabled: isDisabled,
			required: isRequired,
			fullWidth: isFullWidth,
			actionsStyle,
			onClick,
			...otherProps
		} = props;

		const helperTextId = useId();

		const fieldRef = useRef<HTMLDivElement>(null);

		const handleClick = useCallback(
			(event: React.MouseEvent<HTMLElement>) => {
				onClick?.(event);

				if (
					focusTargetRef &&
					focusTargetRef.current &&
					focusTargetRef.current !== document.activeElement
				) {
					focusTargetRef.current.focus();
				}
			},
			[onClick, focusTargetRef]
		);

		// Add keys, if actions is array
		const memoizeActions = useMemo(() => {
			if (Array.isArray(actions)) {
				return actions.map((action, index) => {
					return <Fragment key={index}>{action}</Fragment>;
				});
			} else {
				return actions;
			}
		}, [actions]);

		const childAriaDescribedby = children.props['aria-describedby'];
		const ariaDescribedby: string | undefined = helperText
			? childAriaDescribedby
				? `${childAriaDescribedby} ${helperTextId}`
				: helperTextId
			: childAriaDescribedby;

		const additionalClasses: AdditionalClasses = [
			className,
			styles[`variant-${variant}`],
			styles[`size-${size}`],
			styles[`border-placement-${borderPlacement}`],
		];

		const mods: Mods = {
			[styles['with-adornment']]: Boolean(startAdornment),
			[styles['with-actions']]: Boolean(memoizeActions),
			[styles['focused']]: isFocused,
			[styles['errored']]: isErrored,
			[styles['disabled']]: isDisabled,
			[styles['required']]: isRequired,
			[styles['full-width']]: isFullWidth,
			[styles['hidden-label']]: isHiddenLabel,
		};

		return (
			<div className={classNames(styles['field-container'], additionalClasses, mods)}>
				<FormLabel
					className={classNames(styles['label'], [
						isHiddenLabel ? 'visually-hidden' : undefined,
					])}
					component="label"
					errored={isErrored}
					focused={isFocused}
					required={isRequired}
					disabled={isDisabled}
					id={labelId}
					inputId={inputId}
					focusTarget={focusTargetRef ? focusTargetRef : fieldRef}
				>
					{label}
				</FormLabel>
				<div
					className={classNames(styles['field'], [fieldClassName])}
					onClick={handleClick}
					onMouseDown={e => e.preventDefault()}
					ref={useMergeRefs([ref, fieldRef])}
					{...otherProps}
				>
					{startAdornment && (
						<div className={styles['start-adornment']}>{startAdornment}</div>
					)}
					{cloneElement(children, {
						className: classNames(styles['children'], [children.props.className]),
						'aria-describedby': ariaDescribedby,
					})}
					{memoizeActions && <div className={styles['actions']} style={actionsStyle}>{memoizeActions}</div>}
					{variant === 'outlined' && (
						<fieldset className={styles['fieldset']} aria-hidden="true">
							<legend className={styles['legend']}>
								{isHiddenLabel ? null : (
									<>
										{label}
										{isRequired && ' *'}
									</>
								)}
							</legend>
						</fieldset>
					)}
				</div>
				{helperText && (
					<FormHelperText
						className={styles['helper-text']}
						id={helperTextId}
						errored={isErrored}
					>
						{helperText}
					</FormHelperText>
				)}
			</div>
		);
	}
);
