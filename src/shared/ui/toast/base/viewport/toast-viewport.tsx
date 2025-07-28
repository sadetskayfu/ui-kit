import * as React from 'react';
import { HTMLProps, ModernComponentProps } from '@/shared/helpers/types';
import { useRenderElement } from '@/shared/hooks';
import { useToastProviderContext } from '../provider/toast-provider-context';
import { activeElement, contains, getTarget, matchesFocusVisible } from '@floating-ui/react/utils';
import { ownerDocument } from '@/shared/helpers/owner';
import { FocusGuard } from '@/shared/ui/focus-guard';

/**
 * Renders a `<div>` element.
 */
export const ToastViewport = React.forwardRef(
	(props: ToastViewport.Props, forwardedRef: React.ForwardedRef<HTMLDivElement>) => {
		const { render, className, children, ...otherProps } = props;

        const handlingFocusGuardRef = React.useRef<boolean>(false)

		const {
			toasts,
            viewportRef,
			windowFocusedRef,
			prevFocusElement,
			setPrevFocusElement,
			hasDifferingHeights,
			hovering,
			focused,
			setFocused,
			setHovering,
			pauseTimers,
			resumeTimers,
		} = useToastProviderContext();

		const toastLength = toasts.length;
        
		const handleKeyDown = (event: React.KeyboardEvent) => {
			if (event.key === 'Tab' && event.shiftKey && event.target === viewportRef.current) {
				event.preventDefault();
				prevFocusElement?.focus({ preventScroll: true });
				resumeTimers();
			}
		};

		const handleMouseEnter = () => {
			pauseTimers();
			setHovering(true);
		};

		const handleMouseLeave = () => {
			const activeEl = activeElement(ownerDocument(viewportRef.current));

			if (contains(viewportRef.current, activeEl) && matchesFocusVisible(activeEl)) {
				return;
			}
            
			resumeTimers();
			setHovering(false);
            //setFocused(false)
            
		};
        
		const handleFocusGuard = (event: React.FocusEvent) => {
			if (!viewportRef.current) {
				return;
			}

			handlingFocusGuardRef.current = true;

			if (event.relatedTarget === viewportRef.current) {
				toasts[0]?.ref?.current?.focus();
			} else {
				prevFocusElement?.focus({ preventScroll: true });
			}
		};

		const handleFocus = () => {
            if (handlingFocusGuardRef.current) {
                handlingFocusGuardRef.current = false;
                return;
              }

			if (focused) {
				return;
			}

			const activeEl = activeElement(ownerDocument(viewportRef.current));

			if (!windowFocusedRef.current && !matchesFocusVisible(activeEl)) {
				return;
			}

			pauseTimers();
			setFocused(true);
		};

		const handleBlur = (event: React.FocusEvent) => {
			if (!focused || contains(viewportRef.current, event.relatedTarget)) {
				return;
			}

			resumeTimers();
			setFocused(false);
		};

		// Добавляем клавишу F6 глобально, чтобы устаналивать фокус на viewport
		React.useEffect(() => {
			if (!viewportRef.current) {
				return undefined;
			}

			const handleGlobalKeyDown = (event: KeyboardEvent) => {
				if (toastLength === 0) {
					return;
				}

				if (event.key === 'F6' && event.target !== viewportRef.current) {
					event.preventDefault();

					setPrevFocusElement(
						activeElement(ownerDocument(viewportRef.current)) as HTMLElement | null
					);

					viewportRef.current?.focus();
				}
			};

			const win = ownerDocument(viewportRef.current);

			win.addEventListener('keydown', handleGlobalKeyDown);

			return () => {
				win.removeEventListener('keydown', handleGlobalKeyDown);
			};
		}, [viewportRef, toastLength, setPrevFocusElement]);

		// Следим за фокусом окна, чтобы приостанавливать/возобновлять таймер автозакрытия тостов при смене вкладок
		React.useEffect(() => {
			if (!viewportRef.current || !toastLength) {
				return undefined;
			}

			const win = ownerDocument(viewportRef.current);

			const handleWindowFocus = (event: FocusEvent) => {
				if (event.relatedTarget || event.target === win) {
					return;
				}

				const target = getTarget(event);
				const activeEl = activeElement(ownerDocument(viewportRef.current));

				if (
					!contains(viewportRef.current, target as HTMLElement | null) ||
					!matchesFocusVisible(activeEl)
				) {
					resumeTimers();
				}

                // Ждем пока сработает handleFocus
				setTimeout(() => {
					windowFocusedRef.current = true;
				});
			};

			const handleWindowBlur = (event: FocusEvent) => {
				if (event.target !== win) {
					return;
				}
                console.log('window blur')
				windowFocusedRef.current = false;
				pauseTimers();
			};

			win.addEventListener('focus', handleWindowFocus);
			win.addEventListener('blur', handleWindowBlur);

			return () => {
				win.removeEventListener('focus', handleWindowFocus);
				win.removeEventListener('blur', handleWindowBlur);
			};
		}, [pauseTimers, resumeTimers, toastLength, windowFocusedRef, viewportRef]);

		const localProps: HTMLProps = {
			role: 'region',
			'aria-label': `${toastLength} notification${toastLength !== 1 ? 's' : ''} (F6)`,
			tabIndex: -1,
			onMouseEnter: handleMouseEnter,
			onMouseMove: handleMouseEnter,
			onMouseLeave: handleMouseLeave,
			onFocus: handleFocus,
			onBlur: handleBlur,
			onKeyDown: handleKeyDown,
			onClick: handleFocus,
		};

		const state: ToastViewport.State = React.useMemo(
			() => ({
				expanded: hovering || focused || hasDifferingHeights,
			}),
			[hovering, focused, hasDifferingHeights]
		);

		const element = useRenderElement('div', {
			render,
			className,
			state,
			ref: [forwardedRef, viewportRef],
			props: [
				localProps,
				{
					...otherProps,
					children: (
						<>
							{toastLength > 0 && prevFocusElement && (
								<FocusGuard onFocus={handleFocusGuard} />
							)}
							{children}
							{toastLength > 0 && prevFocusElement && (
								<FocusGuard onFocus={handleFocusGuard} />
							)}
						</>
					),
				},
			],
		});

		return (
			<>
				{toastLength > 0 && prevFocusElement && <FocusGuard onFocus={handleFocusGuard} />}
				{element}
			</>
		);
	}
);

export namespace ToastViewport {
	export interface State {
		expanded: boolean;
	}
	export interface Props extends ModernComponentProps<'div', State> {}
}
