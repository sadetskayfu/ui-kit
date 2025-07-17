import { MenuSizeContext, type MenuSizeContextType } from './menu-size-context';

interface MenuSizeProviderProps extends MenuSizeContextType {
	children: React.ReactNode;
}

export const MenuSizeProvider = ({ children, ...contextProps }: MenuSizeProviderProps) => {
	return <MenuSizeContext.Provider value={{ ...contextProps }}>{children}</MenuSizeContext.Provider>;
};