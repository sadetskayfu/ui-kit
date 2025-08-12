import { applyStyles } from '@/shared/helpers/apply-styles';
import { useEventCallback, useModernLayoutEffect } from '@/shared/hooks';
import * as React from 'react';
import { CollapseRootContext } from './collapse-root-context';

export const CollapseRoot = (props: CollapseRoot.Props) => {
	const {
		children,
		defaultOpen = false,
		open: externalOpen,
		setOpen: externalSetOpen,
		...otherProps
	} = props;

	const [internalOpen, internalSetOpen] = React.useState<boolean>(defaultOpen);
	const [mounted, setMounted] = React.useState<boolean>(defaultOpen);
	const [labelId, setLabelId] = React.useState<string | undefined>(undefined);
	const [panelId, setPanelId] = React.useState<string | undefined>(undefined);

	const open = externalOpen ?? internalOpen;
	const setOpen = externalSetOpen ?? internalSetOpen;

	const panelRef = React.useRef<HTMLDivElement>(null);
	const hasFirstRenderRef = React.useRef<boolean>(false);

	const handleTransitionEnd = React.useCallback((event: React.TransitionEvent) => {
		const panel = panelRef.current;

		if (!panel) {
			return;
		}

		if (event.propertyName === 'height') {
			if (open) {
				applyStyles(panel, { height: 'auto' });
			} else {
				setMounted(false);
			}
		}
	}, [open]);

	useModernLayoutEffect(() => {
		const panel = panelRef.current;

		if (open) {
			setMounted(true);

			if (panel) {
				if (!hasFirstRenderRef.current) {
					applyStyles(panel, { height: 'auto' });

					hasFirstRenderRef.current = true;
				} else {
					const scrollHeight = panel.scrollHeight + 'px';

					applyStyles(panel, { height: scrollHeight });
				}
			}
		} else {
			if (panel) {
				const scrollHeight = panel.scrollHeight + 'px';

				applyStyles(panel, { height: scrollHeight });

				requestAnimationFrame(() => {
					requestAnimationFrame(() => {
						applyStyles(panel, {
							height: '0px',
						});
					});
				});
			}
		}
	}, [open, mounted]);

	const contextValue: CollapseRootContext = React.useMemo(
		() => ({
			labelId,
			setLabelId,
			panelId,
			setPanelId,
			open,
			setOpen,
			mounted,
			panelRef,
			onTransitionEnd: handleTransitionEnd,
		}),
		[labelId, panelId, open, mounted, setOpen, handleTransitionEnd]
	);

	return (
		<CollapseRootContext.Provider value={contextValue}>{children}</CollapseRootContext.Provider>
	);
};

export namespace CollapseRoot {
	export interface Props {
		children?: React.ReactNode;
		defaultOpen?: boolean;
		open?: boolean;
		setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
	}
}
