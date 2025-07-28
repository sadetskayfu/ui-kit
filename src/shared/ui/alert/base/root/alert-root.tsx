import * as React from 'react';
import { ModernComponentProps } from '@/shared/helpers/types';
import { useRenderElement } from '@/shared/hooks';
import { AlertRootContext } from './alert-root-context';

/**
 * Renders a `<div>` element.
 */
export const AlertRoot = React.forwardRef(
	(props: AlertRoot.Props, forwardedRef: React.ForwardedRef<HTMLDivElement>) => {
		const { render, className, role = 'alert', ...otherProps } = props;

		const [titleId, setTitleId] = React.useState<string | undefined>(undefined);
		const [descriptionId, setDescriptionId] = React.useState<string | undefined>(undefined);

		const contextValue: AlertRootContext = React.useMemo(
			() => ({ setTitleId, setDescriptionId }),
			[setTitleId, setDescriptionId]
		);

		const element = useRenderElement('div', {
			render,
			className,
			ref: forwardedRef,
			props: [
				{ role },
				otherProps,
				{ 'aria-labelledby': titleId, 'aria-describedby': descriptionId },
			],
		});

		return (
			<AlertRootContext.Provider value={contextValue}>{element}</AlertRootContext.Provider>
		);
	}
);

export namespace AlertRoot {
	export interface State {}
	export interface Props extends ModernComponentProps<'div', State> {}
}
