import { FloatingDelayGroup } from '@floating-ui/react';
import { type ReactNode } from 'react';

interface DelayGroupProps {
	children: ReactNode;
	timeoutMs?: number;
	delay?:
		| number
		| Partial<{
				open: number;
				close: number;
		  }>;
}

export const DelayGroup = (props: DelayGroupProps) => {
	const { children, delay = 300, timeoutMs = 0 } = props;

	return (
		<FloatingDelayGroup delay={delay} timeoutMs={timeoutMs}>
			{children}
		</FloatingDelayGroup>
	);
};
