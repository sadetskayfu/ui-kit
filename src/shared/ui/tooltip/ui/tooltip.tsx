import { useTooltip, type UseTooltipProps } from '../model/use-tooltip';
import { TooltipContext } from '../model/tooltip-context';

interface TooltipProps extends UseTooltipProps {
	children: React.ReactNode;
}

export const Tooltip = (props: TooltipProps) => {
	const { children, ...useTooltipProps } = props;

	const tooltip = useTooltip(useTooltipProps);

	return <TooltipContext.Provider value={tooltip}>{children}</TooltipContext.Provider>;
};
