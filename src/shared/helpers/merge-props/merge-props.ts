import type { ModernEvent, WithModernEvent } from '../types';
import { mergeObjects } from '../merge-objects';

type PropsOf<T extends React.ElementType> = WithModernEvent<React.ComponentPropsWithoutRef<T>>;
type InputProps<T extends React.ElementType> =
	| PropsOf<T>
	| ((otherProps: PropsOf<T>) => PropsOf<T>)
	| undefined;

const EMPTY_PROPS = {}

export function mergeProps<T extends React.ElementType>(a: InputProps<T>, b: InputProps<T>): PropsOf<T>;
export function mergeProps<T extends React.ElementType>(
  a: InputProps<T>,
  b: InputProps<T>,
  c: InputProps<T>,
): PropsOf<T>;
export function mergeProps<T extends React.ElementType>(
  a: InputProps<T>,
  b: InputProps<T>,
  c: InputProps<T>,
  d: InputProps<T>,
): PropsOf<T>;
export function mergeProps<T extends React.ElementType>(
  a: InputProps<T>,
  b: InputProps<T>,
  c: InputProps<T>,
  d: InputProps<T>,
  e: InputProps<T>,
): PropsOf<T>;
export function mergeProps(a: any, b: any, c?: any, d?: any, e?: any) {
	// We need to mutably own `merged`
	let merged = { ...resolvePropsGetter(a, EMPTY_PROPS) };

	if (b) {
		merged = mergeOne(merged, b);
	}
	if (c) {
		merged = mergeOne(merged, c);
	}
	if (d) {
		merged = mergeOne(merged, d);
	}
	if (e) {
		merged = mergeOne(merged, e);
	}

	return merged
}

export function mergePropsN<T extends React.ElementType>(props: InputProps<T>[]): PropsOf<T> {
    if (props.length === 0) {
      return EMPTY_PROPS as PropsOf<T>;
    }
    if (props.length === 1) {
      return resolvePropsGetter(props[0], EMPTY_PROPS) as PropsOf<T>;
    }
  
    // We need to mutably own `merged`
    let merged = { ...resolvePropsGetter(props[0], EMPTY_PROPS) };
  
    for (let i = 1; i < props.length; i += 1) {
      merged = mergeOne(merged, props[i]);
    }
  
    return merged as PropsOf<T>;
  }

function mergeOne<T extends React.ElementType>(
	merged: Record<string, any>,
	inputProps: InputProps<T>
) {
	if (isPropsGetter(inputProps)) {
		return inputProps(merged as PropsOf<T>);
	}
	return mutablyMergeInto(merged, inputProps);
}

function mutablyMergeInto<T extends React.ElementType>(
	mergedProps: Record<string, any>,
	externalProps: React.ComponentPropsWithRef<T> | undefined
) {
	if (!externalProps) {
		return mergedProps;
	}

	for (const propName in externalProps) {
		const externalPropValue = externalProps[propName];

		switch (propName) {
			case 'style': {
				mergedProps[propName] = mergeObjects(
					mergedProps.style as React.CSSProperties | undefined,
					externalPropValue as React.CSSProperties | undefined
				);
				break;
			}
			case 'className': {
				mergedProps[propName] = mergeClassNames(
					mergedProps.className,
					externalPropValue as string
				);
				break;
			}
			default: {
				if (isEventHandler(propName, externalPropValue)) {
					mergedProps[propName] = mergeEventHandlers(
						mergedProps[propName],
						externalPropValue
					);
				} else {
					mergedProps[propName] = externalPropValue;
				}
			}
		}
	}

	return mergedProps;
}

function isEventHandler(key: string, value: unknown) {
	// This approach is more efficient than using a regex.
	const code0 = key.charCodeAt(0);
	const code1 = key.charCodeAt(1);
	const code2 = key.charCodeAt(2);
	return (
		code0 === 111 /* o */ &&
		code1 === 110 /* n */ &&
		code2 >= 65 /* A */ &&
		code2 <= 90 /* Z */ &&
		(typeof value === 'function' || typeof value === 'undefined')
	);
}

function isSyntheticEvent(event: unknown): event is React.SyntheticEvent {
	return event != null && typeof event === 'object' && 'nativeEvent' in event;
}

function isPropsGetter<T extends React.ComponentType>(
	inputProps: InputProps<T>
): inputProps is (props: PropsOf<T>) => PropsOf<T> {
	return typeof inputProps === 'function';
}

function resolvePropsGetter<T extends React.ElementType>(
	inputProps: InputProps<React.ElementType>,
	previousProps: PropsOf<T>
) {
	if (isPropsGetter(inputProps)) {
		return inputProps(previousProps);
	}

	return inputProps ?? (EMPTY_PROPS as PropsOf<T>);
}

function mergeClassNames(
	ourClassName: string | undefined,
	theirClassName: string | undefined
) {
	if (theirClassName) {
		if (ourClassName) {
			return theirClassName + ' ' + ourClassName;
		}

		return theirClassName;
	}

	return ourClassName;
}

export function makeEventPreventable<Event extends React.SyntheticEvent>(
	event: ModernEvent<Event>
) {
	event.preventLocalHandler = () => {
		(event.localHandlerPrevented as boolean) = true;
	};

	return event;
}

function mergeEventHandlers(
	localHandler: Function | undefined,
	externalHandler: Function | undefined
) {
	if (!externalHandler) {
		return localHandler;
	}
	if (!localHandler) {
		return externalHandler;
	}

	return (event: unknown) => {
		if (isSyntheticEvent(event)) {
			const modernEvent = event as ModernEvent<typeof event>;

			makeEventPreventable(modernEvent);

			const result = externalHandler(modernEvent);

			if (!modernEvent.localHandlerPrevented) {
				localHandler(modernEvent);
			}

			return result;
		}

		const result = externalHandler(event);
		localHandler(event);
		return result;
	};
}
