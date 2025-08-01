import { FloatingDelayGroup } from "@floating-ui/react";

export const TooltipGroup = ({ children, delay = 300 }: TooltipGroup.Props) => {
	return (
		<FloatingDelayGroup delay={delay}>
			{children}
		</FloatingDelayGroup>
	);
};

export namespace TooltipGroup {
    export interface Props {
        children?: React.ReactNode
        /**
         * @default 300
         */
        delay?: number | { open: number, close: number }
    }
}
