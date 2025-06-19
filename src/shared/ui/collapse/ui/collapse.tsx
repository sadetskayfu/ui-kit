import { CollapseContext } from '../model/collapse-context';
import { useCollapse, type UseCollapseProps } from '../model/use-collapse';

export interface CollapseProps extends UseCollapseProps {
	children: React.ReactNode;
}

export const Collapse = (props: CollapseProps) => {
	const { children, ...useCollapseProps } = props;

	const collapse = useCollapse(useCollapseProps);

	return <CollapseContext.Provider value={collapse}>{children}</CollapseContext.Provider>;
};
