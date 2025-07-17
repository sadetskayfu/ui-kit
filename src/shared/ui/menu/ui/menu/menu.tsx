import {
	FloatingFocusManager,
	FloatingList,
	FloatingNode,
	FloatingPortal,
	FloatingTree,
	useFloatingParentNodeId,
	useListItem,
	useMergeRefs,
} from '@floating-ui/react';
import { useContext, useMemo, type HTMLAttributes, type ReactElement } from 'react';
import { useMenuContext } from '../../model/use-menu-context';
import { useMenu, type UseMenuProps } from '../../model/use-menu';
import { Overlay } from '@/shared/ui/overlay';
import { RemoveScroll } from 'react-remove-scroll';
import { MenuContext } from '../../model/menu-context';
import { classNames, type Mods } from '@/shared/helpers/class-names';
import { MenuSizeContext } from './menu-size-context';
import styles from './menu.module.scss';

interface MenuProps extends UseMenuProps {
	className?: string;
	contentClassName?: string;
	children: React.ReactNode;
	modal?: boolean;
	removeScroll?: boolean;
	portalTargetRef?: React.RefObject<HTMLElement | null>;
	style?: React.CSSProperties
	triggerRef?: React.RefObject<HTMLElement | null>
	renderTrigger: (
		props: Omit<HTMLAttributes<HTMLElement>, 'color'> & {
			'data-open'?: string;
		}
	) => ReactElement;
}

export const MenuComponent = (props: MenuProps) => {
	const {
		className,
		contentClassName,
		children,
		modal,
		removeScroll = false,
		portalTargetRef,
		style,
		triggerRef,
		renderTrigger,
		...useMenuProps
	} = props;

	const {
		isOpen,
		isMounted,
		isNested,
		isInstantPhase,
		activeIndex,
		status,
		padding,
		nodeId,
		context,
		refs,
		elementsRef,
		labelsRef,
		floatingStyles,
		getReferenceProps,
		getFloatingProps,
		getItemProps,
	} = useMenu(useMenuProps);

	const item = useListItem();
	const parent = useMenuContext();

	const sizeContext = useContext(MenuSizeContext)

	const mergeTriggerRef = useMergeRefs([refs.setReference, item.ref, triggerRef]);

	const mods: Mods = {
		[styles['open']]: status === 'open',
		[styles['close']]: status === 'close',
		[styles['root-menu']]: !isNested,
		[styles['instant-phase']]: isInstantPhase,
	};

	const trigger = useMemo(() => {
		return renderTrigger({
			...getReferenceProps({ ref: mergeTriggerRef, ...parent.getItemProps() }),
			'data-open': isOpen ? '' : undefined,
		});
	}, [getReferenceProps, mergeTriggerRef, renderTrigger, parent, isOpen]);

	return (
		<FloatingNode id={nodeId}>
			{trigger}
			<MenuContext.Provider
				value={useMemo(() => ({ activeIndex, getItemProps }), [activeIndex, getItemProps])}
			>
				<FloatingList elementsRef={elementsRef} labelsRef={labelsRef}>
					{isMounted && (
						<FloatingPortal root={portalTargetRef}>
							{modal && <Overlay variant="transparent" />}
							<FloatingFocusManager
								context={context}
								modal={modal}
								returnFocus={false}
								initialFocus={isNested ? -1 : 0}
							>
								<RemoveScroll enabled={removeScroll}>
									<div
										className={classNames(styles['menu'], [className])}
										role="presentation"
										ref={refs.setFloating}
										style={{...floatingStyles, width: sizeContext?.width, ...style}}
									>
										<div
											className={classNames(
												styles['content'],
												[contentClassName],
												mods
											)}
											aria-modal={modal ? 'true' : undefined}
											style={{padding}}
											{...getFloatingProps()}
										>
											{children}
										</div>
									</div>
								</RemoveScroll>
							</FloatingFocusManager>
						</FloatingPortal>
					)}
				</FloatingList>
			</MenuContext.Provider>
		</FloatingNode>
	);
};

export const Menu = (props: MenuProps) => {
	const parentId = useFloatingParentNodeId();

	if (parentId === null) {
		return (
			<FloatingTree>
				<MenuComponent {...props} />
			</FloatingTree>
		);
	}

	return <MenuComponent {...props} />;
};
