import * as React from 'react';
import { classNames, type AdditionalClasses, type Mods } from '@/shared/helpers/class-names';
import { useRenderElement } from '@/shared/hooks';
import styles from './form-label.module.scss';

/**
 * Renders a `<span>` element.
 */
export const FormLabel = React.memo(React.forwardRef((props: FormLabel.Props, forwardedRef: React.ForwardedRef<HTMLElement>) => {
	const {
		className,
		children,
		Tag = 'span',
		color = 'soft',
		required,
		focused,
		errored,
		hidden,
		...otherProps
	} = props;

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
		 * @default 'soft'
		 */
		color?: 'soft' | 'hard';
		required?: boolean;
		focused?: boolean;
		errored?: boolean;
		hidden?: boolean
	}
}
