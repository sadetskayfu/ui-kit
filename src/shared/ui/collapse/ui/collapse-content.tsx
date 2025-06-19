import { classNames, type Mods } from '@/shared/helpers/class-names';
import { useCollapseContext } from '../model/use-collapse-context';
import type { AriaRole } from 'react';
import styles from './collapse.module.scss';

interface CollapseContentProps {
	className?: string;
	children: React.ReactNode;
	style?: React.CSSProperties;
	role?: AriaRole;
}

export const CollapseContent = ({
	className,
	children,
	style,
	role = 'region',
}: CollapseContentProps) => {
	const { isMounted, isLazy, isFade, bodyId, labelId, elementRef } = useCollapseContext();

	const mods: Mods = {
		[styles['fade']]: isFade,
	};

	return (
		<>
			{(!isLazy || isMounted) && (
				<div
					className={classNames(styles['collapse'], [className], mods)}
					ref={elementRef}
					id={bodyId}
					style={style}
					aria-labelledby={labelId}
					role={role}
				>
					{children}
				</div>
			)}
		</>
	);
};
