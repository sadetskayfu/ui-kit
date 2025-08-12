import { ScrollArea } from '@/shared/ui/scroll-area';
import { BaseSelect } from '../../base';
import { useSelectRootContext } from '../root/select-root-context';

export const SelectList = (props: SelectList.Props) => {
	const { children, className, style } = props;

	const { scrollAreaRootRef } = useSelectRootContext();

	return (
		<ScrollArea.Root
			ref={scrollAreaRootRef}
			className={className}
			style={style}
			orientation="vertical"
		>
			<ScrollArea.Viewport tabIndex={-1}>
				<ScrollArea.Content>
					<BaseSelect.List>{children}</BaseSelect.List>
				</ScrollArea.Content>
				<ScrollArea.Scrollbar orientation="vertical" alwaysVisible />
			</ScrollArea.Viewport>
		</ScrollArea.Root>
	);
};

export namespace SelectList {
	export interface Props {
		children?: React.ReactNode;
		className?: string;
		style?: React.CSSProperties;
	}
}
