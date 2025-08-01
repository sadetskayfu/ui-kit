import { Tooltip } from '..';

/**
 * Абстракиця над Tooltip
 */
export const TextTooltip = (props: TextTooltip.Props) => {
	const {
		children,
		label,
		renderContent,
		className,
		contentClassName,
		centeringText,
		...otherProps
	} = props;

	return (
		<Tooltip.Root {...otherProps}>
			<Tooltip.Trigger render={children} />
			<Tooltip.Popup
				className={className}
				contentClassName={contentClassName}
				centeringText={centeringText}
			>
				{renderContent ? renderContent() : <span className="fz-2">{label}</span>}
				<Tooltip.Arrow />
			</Tooltip.Popup>
		</Tooltip.Root>
	);
};

export namespace TextTooltip {
	export interface Props extends Tooltip.Root.Props {
		/**
		 * Trigger element
		 */
		children: React.ReactElement<Record<string, unknown>>;
		label?: string | number;
		className?: string;
		contentClassName?: string;
		centeringText?: boolean;
		renderContent?: () => React.ReactNode;
	}
}
