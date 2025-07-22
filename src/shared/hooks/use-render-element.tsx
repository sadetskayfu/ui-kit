import React from 'react';
import { mergePropsN } from '../helpers/merge-props';
import type {
	ComponentClassName,
	ComponentRender,
	ComponentState,
} from '../helpers/types';
import { resolveClassName } from '../helpers/resolve-class-name';
import { useMergeRefs } from '@floating-ui/react';
import { classNames } from '../helpers/class-names';
import { EMPTY_OBJECT } from '../constants';

type IntrinsicTagName = keyof React.JSX.IntrinsicElements;
type Props<TagName> = TagName extends keyof React.JSX.IntrinsicElements
	? React.JSX.IntrinsicElements[TagName]
	: React.HTMLAttributes<any>;

interface UseRenderElementParams<
	TagName extends IntrinsicTagName,
	ElementType extends Element,
	State extends ComponentState,
	Enabled extends boolean | undefined = undefined,
> {
	props:
		| Props<TagName>
		| Array<Props<TagName> | undefined | ((props: Props<TagName>) => Props<TagName>)>;
	className?: ComponentClassName<State>
	render?: ComponentRender<React.HTMLAttributes<any>, State>
	state?: State;
	ref?: React.Ref<ElementType> | (React.Ref<ElementType> | undefined)[];
	enabled?: Enabled;
}

export function useRenderElement<
	TagName extends IntrinsicTagName,
	ElementType extends Element,
	State extends ComponentState,
	Enabled extends boolean | undefined = undefined,
>(
	tagName: TagName,
	params: UseRenderElementParams<TagName, ElementType, State, Enabled>
): Enabled extends false ? null : React.ReactElement {
	const { props, className, render, state = EMPTY_OBJECT as State, ref, enabled = true } = params;

	const outProps: React.HTMLAttributes<any> & React.RefAttributes<any> = enabled
		? Array.isArray(props)
			? mergePropsN(props)
			: props
		: EMPTY_OBJECT;

	outProps.ref = useMergeRefs(enabled ? (Array.isArray(ref) ? [outProps.ref, ...ref] : [outProps.ref, ref]) : [null]);

	if (!enabled) return null as Enabled extends false ? null : React.ReactElement;

	const resolvedClassName = className ? resolveClassName(className, state) : undefined;

	if (resolvedClassName) {
		outProps.className = classNames(resolvedClassName, [outProps.className]);
	}

	if (render) {
		return render(outProps, state) as Enabled extends false ? null : React.ReactElement;
	}

	return renderTag(tagName, outProps) as Enabled extends false ? null : React.ReactElement;
}

function renderTag(TagName: React.ElementType, props: Record<string, any>) {
	if (TagName === 'button') {
		return <button type="button" {...props} />;
	}
	if (TagName === 'img') {
		return <img alt="" {...props} />;
	}
	return React.createElement(TagName, props);
}
