import * as React from 'react';
import { ModernComponentProps } from '@/shared/helpers/types';
import { useRenderElement } from '@/shared/hooks';
import { SelectGroupContext } from './select-group-context';

/**
 * Renders a `<div>` element.
 */
export const SelectGroup = React.forwardRef(
	(props: SelectGroup.Props, forwardedRef: React.ForwardedRef<HTMLDivElement>) => {
		const { render, className, ...otherProps } = props;

		const [labelId, setLabelId] = React.useState<string | undefined>();

		const contextValue: SelectGroupContext = React.useMemo(
			() => ({
				labelId,
				setLabelId,
			}),
			[labelId, setLabelId]
		);

		const element = useRenderElement('div', {
			render,
			className,
			ref: forwardedRef,
			props: [{ role: 'group', 'aria-labelledby': labelId }, otherProps],
		});

		return (
			<SelectGroupContext.Provider value={contextValue}>
				{element}
			</SelectGroupContext.Provider>
		);
	}
);

export namespace SelectGroup {
	export interface State {}
	export interface Props extends ModernComponentProps<'div', State> {}
}
