import * as React from 'react';
import { classNames, type AdditionalClasses, type Mods } from '@/shared/helpers/class-names';
import { useRenderElement } from '@/shared/hooks';
import { activeElement, getTarget } from '@floating-ui/react/utils';
import { ownerDocument } from '@/shared/helpers/owner';
import styles from './form-label.module.scss';

/**
 * Renders a `<span>` element.
 */
export const FormLabel = React.memo(React.forwardRef((props: FormLabel.Props, forwardedRef: React.ForwardedRef<HTMLElement>) => {
	const {
		className,
		children,
		Tag = 'span',
		focusTargetRef,
		color = 'soft',
		required,
		focused,
		errored,
		hidden,
		...otherProps
	} = props;

	const handleClick = React.useCallback(
		(event: React.MouseEvent<HTMLElement>) => {
			if (
				focusTargetRef?.current &&
				focusTargetRef.current !==
					activeElement(ownerDocument(getTarget(event.nativeEvent) as HTMLElement | null))
			) {
				focusTargetRef.current.focus();
			}
		},
		[focusTargetRef]
	);

	const additionalClasses: AdditionalClasses = [className, hidden ? 'visually-hidden' : undefined, styles[`color-${color}`]];

	const mods: Mods = {
		[styles['focused']]: focused,
		[styles['errored']]: errored,
	};

	return useRenderElement(Tag, {
		ref: forwardedRef,
		props: [
			{
				className: classNames(styles['form-label'], additionalClasses, mods),
				onClick: handleClick,
				children: (
					<>
						{children}
						{required && <span className={styles['required-indicator']} aria-hidden='true'> *</span>}
					</>
				),
			},
			otherProps,
		],
	});
}));

export namespace FormLabel {
	export interface Props extends React.HTMLAttributes<HTMLElement> {
		/**
		 * @default 'span'
		 */
		Tag?: keyof React.JSX.IntrinsicElements;
		/**
		 * Ref элемента, на который нужно установить фокус при клике по лейблу
		 */
		focusTargetRef?: React.RefObject<HTMLElement | null>;
		/**
		 * @default 'soft'
		 */
		color?: 'soft' | 'hard';
		required?: boolean;
		focused?: boolean;
		errored?: boolean;
		hidden?: boolean
	}
}
